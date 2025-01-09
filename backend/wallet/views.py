from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from wallet.serializers import AddMoneySerializer, RemoveMoneySerializer
from .models import Wallet
from src.models import Dealership, Rentoid
from home.models import Offer, Rent
from .serializers import *
from django.shortcuts import get_object_or_404, redirect
import stripe
from dotenv import load_dotenv
import os

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
def Rent(request, offer_id):
    offer = get_object_or_404(Offer, offer_id=offer_id)
    buyer_id = request.data.get("buyer_id")
    method = request.data.get("paymentMethod")
    dateFrom = request.data.get("dateFrom")
    dateTo = request.data.get("dateFrom")
    if buyer_id is None:
        return Response(
            {"detail": "No buyer provided."}, status=status.HTTP_400_BAD_REQUEST
        )
    if (method is None) or (method != "stripe" and method != "wallet"):
        return Response(
            {"detail": "No valid method provided."}, status=status.HTTP_400_BAD_REQUEST
        )
    if dateTo is None or dateFrom is None:
        return Response(
            {"detail": "No dates provided."}, status=status.HTTP_400_BAD_REQUEST
        )

    dealer_id = offer.dealer_id
    model_id = offer.model_id
    # company = get_object_or_404(Dealership, dealership_id=dealer_id)
    wallet = get_object_or_404(Wallet, rentoid_id=buyer_id)

    # Handle payment via Wallet
    if method == "wallet":
        if wallet.gems < offer.price:
            return Response(
                {"detail": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Deduct the money from wallet
        wallet.gems -= offer.price
        wallet.save()

        # You can add additional logic here (e.g., create a Rent model, etc.)
        return Response(
            {
                "detail": "Payment successful via wallet",
                "company": dealer_id,
                "wallet": wallet.wallet_id,
                "new_balance": wallet.gems,
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
                            "product_data": {"name": "My Product"},
                            "unit_amount": offer.price * 100,
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url=request.build_absolute_uri("/success/"),
                cancel_url=request.build_absolute_uri("/cancel/"),
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
