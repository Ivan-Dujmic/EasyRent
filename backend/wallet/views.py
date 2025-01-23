from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
import time
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from wallet.serializers import AddMoneySerializer, RemoveMoneySerializer
from .models import Wallet, Transactions
from src.models import Dealership, Rentoid, Location, WorkingHours
from home.models import Offer, Rent, Vehicle, Model
from .serializers import *
from django.shortcuts import get_object_or_404, redirect
import stripe
from dotenv import load_dotenv
import os
import datetime
from django.utils.dateparse import parse_datetime
from django.db.models import F, ExpressionWrapper, DecimalField, Q
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_exempt

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SK")


@csrf_exempt
@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
)
@api_view(["GET"])
def getBalance(request):
    if request.user.is_authenticated:
        rentoid = get_object_or_404(Rentoid, user=request.user.id)
    else:
        return Response({"error": "No user authenticated"}, status=404)
    rentoid_id = rentoid.rentoid_id
    wallet = get_object_or_404(Wallet, rentoid_id=rentoid_id)
    return Response({"Balance": wallet.gems}, status=status.HTTP_200_OK)


@csrf_exempt
@extend_schema(
    tags=["admin"],  # Group under "admin" tag
    request=AddMoneySerializer,
)
@api_view(["POST"])
def addMoney(request, rentoid_id):
    if not (request.user.is_authenticated and request.user.is_superuser):
        return Response({"error": "No super user authenticated"}, status=404)

    wallet = get_object_or_404(Wallet, rentoid_id=rentoid_id)
    amount = request.data.get("amount")

    if amount is None or amount <= 0:
        return Response(
            {"detail": "Amount must be greater than 0."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    wallet.gems += amount
    wallet.save()

    return Response(
        {
            "wallet_id": wallet.wallet_id,
            "rentoid": wallet.rentoid.rentoid_id,
            "new_balance": wallet.gems,
        }
    )


# Remove money from an existing wallet
@csrf_exempt
@extend_schema(
    tags=["admin"],  # Group under "admin" tag
    request=RemoveMoneySerializer,
)
@api_view(["POST"])
def removeMoney(request, rentoid_id):
    if not (request.user.is_authenticated and request.user.is_superuser):
        return Response({"error": "No super user authenticated"}, status=404)
    wallet = get_object_or_404(Wallet, rentoid_id=rentoid_id)
    amount = request.data.get("amount")

    if amount is None or amount <= 0:
        return Response(
            {"detail": "Amount must be greater than 0."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if wallet.gems < amount:
        return Response(
            {"detail": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST
        )

    wallet.gems -= amount
    wallet.save()

    return Response(
        {
            "wallet_id": wallet.wallet_id,
            "rentoid": wallet.rentoid.rentoid_id,
            "new_balance": wallet.gems,
        }
    )


@csrf_exempt
@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
    request=OfferSerializer,
)
@api_view(["POST"])
def offerRent(request, offer_id):
    offer = get_object_or_404(Offer, offer_id=offer_id)
    method = request.data.get("paymentMethod")
    pickupDate = request.data.get("dateFrom")
    dropoffDate = request.data.get("dateTo")
    pickupTime = request.data.get("pickupTime")
    dropoffTime = request.data.get("dropoffTime")
    pickup_locid = request.data.get("pickLocId")
    dropoff_locid = request.data.get("dropLocId")

    if request.user.is_authenticated:
        rentoid = get_object_or_404(Rentoid, user=request.user.id)
    else:
        return Response({"error": "No user authenticated"}, status=404)
    buyer_id = rentoid.rentoid_id
    if (method is None) or (method != "stripe" and method != "wallet"):
        return Response(
            {"detail": "No valid method provided."}, status=status.HTTP_400_BAD_REQUEST
        )

    if (
        pickupTime == None
        or dropoffDate == None
        or dropoffTime == None
        or pickupDate == None
    ):
        return Response({"error": "Required fields not filled"}, status=404)
    # check if times are valid
    try:
        pickupTime = int(pickupTime)
        dropoffTime = int(dropoffTime)
    except:
        return Response({"error": "Invalid time format"}, status=404)
    if pickupTime < 0 or pickupTime > 24 or dropoffTime < 0 or dropoffTime > 24:
        return Response({"error": "Invalid time format"}, status=404)
    # check if dates are valid
    date_format = "%d-%m-%Y"
    try:
        pickupDate = datetime.datetime.strptime(pickupDate, date_format).date()
        dropoffDate = datetime.datetime.strptime(dropoffDate, date_format).date()
    except ValueError:
        return Response({"error": "Invalid date format"}, status=404)

    try:
        pickup_datetime = datetime.datetime.combine(
            pickupDate, datetime.time(pickupTime)
        )
    except ValueError:
        return Response({"error": "Invalid pickup datetime format"}, status=404)

    # Combine dropoffDate + dropoffTime to create a full datetime for the dropoff
    try:
        dropoff_datetime = datetime.datetime.combine(
            dropoffDate, datetime.time(dropoffTime)
        )
    except ValueError:
        return Response({"error": "Invalid dropoff datetime format"}, status=404)

    dealer_id = offer.dealer_id
    model_id = offer.model_id
    # company = get_object_or_404(Dealership, dealership_id=dealer_id)
    wallet = get_object_or_404(Wallet, rentoid_id=buyer_id)

    # Check if the vehicle is available in the given datetime range
    available_vehicles = (
        Vehicle.objects.filter(
            dealer_id=dealer_id,  # Filter by dealership ID
            model_id=model_id,  # Filter by model ID
            location_id=pickup_locid,
        )
        .exclude(
            Q(
                rent__dateTimeRented__lte=dropoff_datetime
            )  # Rent started before or during the requested period
            & Q(
                rent__dateTimeReturned__gte=pickup_datetime
            )  # Rent returned after or during the requested period
        )
        .values("vehicle_id")
    )
    if len(available_vehicles) == 0:
        return Response(
            {"error": "No available vehicles for given parameters."}, status=404
        )

    vehicle_id = available_vehicles[0]["vehicle_id"]
    diff = dropoff_datetime - pickup_datetime
    total_hours = diff.total_seconds() / 3600
    totalPrice = round(float(offer.price) * total_hours / 24, 2)
    gemPrice = int(totalPrice * 100)
    vehDropoff = Dealership.objects.filter(
        location__location_id=dropoff_locid, dealership_id=dealer_id
    )
    if not vehDropoff.exists():
        return Response({"error": "No dropoff location for given company"}, status=404)
    pickupHour = pickup_datetime.time()
    pickDay = pickup_datetime.weekday()
    dropDay = dropoff_datetime.weekday()
    dropoffHour = dropoff_datetime.time()
    if pickup_datetime > dropoff_datetime:
        return Response({"error": "Pickup datetime must be before dropoff datetime."}, status=404)
    workingHpick = WorkingHours.objects.filter(
        location_id=pickup_locid, dayOfTheWeek=pickDay
    ).exclude(Q(startTime__gte=pickupHour) | Q(endTime__lte=pickupHour))
    if not workingHpick.exists():
        return Response({"error": "Pickuptime outside off working hours."}, status=404)
    workingHdrop = WorkingHours.objects.filter(
        location_id=dropoff_locid, dayOfTheWeek=dropDay
    ).exclude(Q(startTime__gte=dropoffHour) | Q(endTime__lte=dropoffHour))
    if not workingHdrop.exists():
        return Response({"error": "Dropoff outside off working hours."}, status=404)
    print(offer.price, totalPrice, diff.days, buyer_id, gemPrice)
    # Handle payment via Wallet
    if method == "wallet":
        if wallet.gems < gemPrice:
            return Response(
                {"detail": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Deduct the money from wallet
        wallet.gems -= gemPrice
        wallet.save()

        # Create the Rent entry
        rent = Rent.objects.create(
            dealer_id=dealer_id,
            rentoid_id=buyer_id,
            dateTimeRented=pickup_datetime,
            dateTimeReturned=dropoff_datetime,
            vehicle_id=vehicle_id,
            rentedLocation_id=pickup_locid,
            returnLocation_id=dropoff_locid,
            price=totalPrice,
        )

        return Response(
            {
                "detail": "Payment successful via wallet",
                "company": dealer_id,
                "wallet": wallet.wallet_id,
                "new_balance": wallet.gems,
                "rent_id": rent.rent_id,
            },
            status=status.HTTP_200_OK,
        )

    # Handle payment via Stripe (Stripe Checkout)
    elif method == "stripe":
        try:
            # Create a Stripe Checkout session
            trans = Transactions.objects.create(status="unfinished")
            model = get_object_or_404(Model, model_id=model_id)
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "eur",
                            "product_data": {
                                "name": f"{model.makeName} {model.modelName}",
                                "description": f"Rent from {pickupDate} through {dropoffDate}"
                            },
                            "unit_amount": int(totalPrice * 100),
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url="https://easy-rent-ashy.vercel.app/success",
                cancel_url="https://easy-rent-ashy.vercel.app/home",
                expires_at=int(time.time()) + 1800,
                metadata={
                    "payment": "offer",
                    "dealer_id": dealer_id,
                    "rentoid_id": buyer_id,
                    "dateTimeRented": f"{pickup_datetime}",
                    "dateTimeReturned": f"{dropoff_datetime}",
                    "pickup_locid": pickup_locid,
                    "dropoff_locid": dropoff_locid,
                    "vehicle_id": vehicle_id,
                    "price": totalPrice,
                    "trans_id": trans.id,
                },
            )
            # Return the checkout_url to frontend to initiate immediate redirect
            return Response(
                {"detail": checkout_session.url, "trans_id": trans.id},
                status=status.HTTP_200_OK,
            )

        except stripe.error.StripeError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # If method is invalid
    return Response(
        {"detail": "Invalid payment method."},
        status=status.HTTP_400_BAD_REQUEST,
    )


@csrf_exempt
@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
    request=BuyGemsSerializer,
)
@api_view(["POST"])
def buyGems(request):
    if request.user.is_authenticated:
        rentoid = get_object_or_404(Rentoid, user=request.user.id)
    else:
        return Response({"error": "No user authenticated"}, status=404)
    amount = request.data.get("amount")
    try:
        amount = int(amount) if amount else None
    except ValueError as e:
        return Response({"error": "Nan provided"}, status=status.HTTP_404_NOT_FOUND)
    print(amount)
    buy = 0
    if amount is not None:
        buy = amount
    rentoid_id = rentoid.rentoid_id
    wallet = get_object_or_404(Wallet, rentoid_id=rentoid_id)
    try:
        # Create a Stripe Checkout session
        trans = Transactions.objects.create(status="unfinished")
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
            {
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": f"Buying {amount} gems"},
                    "unit_amount": buy,
                },
                "quantity": 1,
            }
            ],
            mode="payment",
            success_url="https://easy-rent-ashy.vercel.app/success",
            cancel_url="https://easy-rent-ashy.vercel.app/home",
            expires_at=int(time.time()) + 1800,
            metadata={
                "payment": "buyGems",
                "rentoid_id": rentoid_id,
                "gems": amount,
                "trans_id": trans.id,
            },
        )
        # Return the checkout_url to frontend to initiate immediate redirect
        return Response(
            {"detail": checkout_session.url, "trans_id": trans.id},
            status=status.HTTP_200_OK,
        )

    except stripe.error.StripeError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = os.getenv("STRIPE_WH")

    event = None
    print("in webhook")
    try:
        # Verify the webhook signature
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        # Invalid payload
        return Response({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return Response({"error": "Invalid signature"}, status=400)

    # Handle the checkout.session.completed event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]  # contains a stripe.checkout.Session object
        print("Checkout session was successfully completed!")

        # Payment status and customer details can be retrieved from the session object
        payment_status = session.get("payment_status")

        # If payment is successful, you can process the order
        if payment_status == "paid":
            print("payment paid")
            metadata = session.get("metadata", {})
            metadata = session.get("metadata", {})

            # Extract metadata values and convert them back to their original variable types
            # Convert the ID values into integers (with error handling)
            pay_type = metadata.get("payment")
            if pay_type == "offer":
                dealer_id = metadata.get("dealer_id")
                rentoid_id = metadata.get("rentoid_id")
                vehicle_id = metadata.get("vehicle_id")
                trans_id = metadata.get("trans_id")
                pickup_locid = metadata.get("pickup_locid")
                dropoff_locid = metadata.get("dropoff_locid")
                # Convert metadata fields to integers if they exist, else handle the error
                try:
                    dealer_id = int(dealer_id) if dealer_id else None
                    rentoid_id = int(rentoid_id) if rentoid_id else None
                    vehicle_id = int(vehicle_id) if vehicle_id else None
                    trans_id = int(trans_id) if trans_id else None
                    pickup_locid = int(pickup_locid) if pickup_locid else None
                    dropoff_locid = int(dropoff_locid) if dropoff_locid else None
                except ValueError as e:
                    return Response(
                        {"error": "Invalid metadata value for ID fields"}, status=400
                    )

                # Convert datetime strings back to datetime objects
                dateTimeRented = parse_datetime(metadata.get("dateTimeRented"))
                dateTimeReturned = parse_datetime(metadata.get("dateTimeReturned"))

                # Convert price back to float (if necessary)
                price = float(metadata.get("price", 0))
                Rent.objects.create(
                    dealer_id=dealer_id,
                    rentoid_id=rentoid_id,
                    dateTimeRented=dateTimeRented,
                    dateTimeReturned=dateTimeReturned,
                    vehicle_id=vehicle_id,
                    rentedLocation_id=pickup_locid,
                    returnLocation_id=dropoff_locid,
                    price=price,
                )
                trans = get_object_or_404(Transactions, id=trans_id)
                trans.status = "finished"
                trans.save()
                return Response({"paymentStatus": "payment paid"})
            elif pay_type == "buyGems":
                print("in Buy Gems")
                rentoid_id = metadata.get("rentoid_id")
                amount = metadata.get("gems")
                trans_id = metadata.get("trans_id")
                try:
                    rentoid_id = int(rentoid_id) if rentoid_id else None
                    amount = int(amount) if amount else None
                    trans_id = int(trans_id) if trans_id else None
                except ValueError as e:
                    return Response(
                        {"error": "Invalid metadata value for ID fields"}, status=400
                    )
                wallet = get_object_or_404(Wallet, rentoid_id=rentoid_id)
                wallet.gems += amount
                wallet.save()
                print(wallet.gems, amount)
                trans = get_object_or_404(Transactions, id=trans_id)
                trans.status = "finished"
                trans.save()
                return Response({"paymentStatus": "payment paid"})

        else:
            print("failed to pay")
            return Response({"paymentStatus": "unsuccessful payment"})

    else:
        print(f"Unhandled event type: {event['type']}")

    # Respond with a success status
    return Response({"status": "success"})


@csrf_exempt
@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
)
@api_view(["GET"])
def check_transaction(request, trans_id):
    trans = get_object_or_404(Transactions, id=trans_id)
    if trans.status == "finished":
        return Response({"paymentStatus": "successful payment"})
    else:
        return Response({"paymentStatus": "unsuccessful payment"})
