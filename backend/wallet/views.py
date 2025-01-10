from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
import time
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from wallet.serializers import AddMoneySerializer, RemoveMoneySerializer
from .models import Wallet
from src.models import Dealership, Rentoid
from home.models import Offer, Rent, Vehicle
from .serializers import *
from django.shortcuts import get_object_or_404, redirect
import stripe
from dotenv import load_dotenv
import os
import datetime
from django.utils.dateparse import parse_datetime
from django.db.models import F, ExpressionWrapper, DecimalField, Q
from django.views.decorators.csrf import csrf_exempt

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SK")


@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
)
@api_view(["GET"])
def getBalance(request, rentoid_id):
    wallet = get_object_or_404(Wallet, rentoid_id=rentoid_id)
    return Response({"Balance": wallet.gems}, status=status.HTTP_200_OK)


@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
    request=AddMoneySerializer,
)
@api_view(["POST"])
def addMoney(request, rentoid_id):
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
@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
    request=RemoveMoneySerializer,
)
@api_view(["POST"])
def removeMoney(request, rentoid_id):
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


@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
    request=OfferSerializer,
)
@api_view(["POST"])
def offerRent(request, offer_id):
    offer = get_object_or_404(Offer, offer_id=offer_id)
    buyer_id = request.data.get("buyer_id")
    method = request.data.get("paymentMethod")
    pickupDate = request.data.get("dateFrom")
    dropoffDate = request.data.get("dateTo")
    pickupTime = request.data.get("pickupTime")
    dropoffTime = request.data.get("dropoffTime")
    if buyer_id is None:
        return Response(
            {"detail": "No buyer provided."}, status=status.HTTP_400_BAD_REQUEST
        )
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
    totalPrice = offer.price * int(diff.days)
    print(offer.price, totalPrice, diff.days)
    # Handle payment via Wallet
    if method == "wallet":
        if wallet.gems < totalPrice:
            return Response(
                {"detail": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Deduct the money from wallet
        wallet.gems -= totalPrice
        wallet.save()

        # Create the Rent entry
        rent = Rent.objects.create(
            dealer_id=dealer_id,
            rentoid_id=buyer_id,
            dateTimeRented=pickup_datetime,
            dateTimeReturned=dropoff_datetime,
            vehicle_id=vehicle_id,
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
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "eur",
                            "product_data": {"name": offer.description},
                            "unit_amount": int(totalPrice * 100),
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url="http://localhost:3000/success/",
                cancel_url="http://localhost:3000/cancel/",
                expires_at=int(time.time()) + 1800,
                metadata={
                    "dealer_id": dealer_id,
                    "rentoid_id": buyer_id,
                    "dateTimeRented": f"{pickup_datetime}",
                    "dateTimeReturned": f"{dropoff_datetime}",
                    "vehicle_id": vehicle_id,
                    "price": totalPrice,
                },
            )
            # Return the checkout_url to frontend to initiate immediate redirect
            return Response({"detail": checkout_session.url}, status=status.HTTP_200_OK)

        except stripe.error.StripeError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # If method is invalid
    return Response(
        {"detail": "Invalid payment method."},
        status=status.HTTP_400_BAD_REQUEST,
    )


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
            dealer_id = metadata.get("dealer_id")
            rentoid_id = metadata.get("rentoid_id")
            vehicle_id = metadata.get("vehicle_id")

            # Convert metadata fields to integers if they exist, else handle the error
            try:
                dealer_id = int(dealer_id) if dealer_id else None
                rentoid_id = int(rentoid_id) if rentoid_id else None
                vehicle_id = int(vehicle_id) if vehicle_id else None
            except ValueError as e:
                return Respose(
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
                price=price,
            )
            return Response({"paymentStatus": "payment paid"})

        else:
            print("failed to pay")
            return Response({"paymentStatus": "unsuccessfull payment"})

    else:
        print(f"Unhandled event type: {event['type']}")

    # Respond with a success status
    return Response({"status": "success"})
