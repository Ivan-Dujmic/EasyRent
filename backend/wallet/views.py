from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Wallet
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


# Add a new wallet account for a user
@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
    responses={
        201: OpenApiResponse(
            description="Wallet successfully created",
            examples=[
                OpenApiExample(
                    "Wallet Created",
                    value={"wallet_id": 1, "user_id": 1, "gems": 0.00},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Bad Request",
            examples=[
                OpenApiExample(
                    "Invalid User ID", value={"detail": "Invalid user ID provided"}
                ),
            ],
        ),
    },
)
@api_view(["POST"])
def addAccount(request):
    user_id = request.data.get("user_id")
    user = get_object_or_404(User, pk=user_id)

    # Create a new Wallet instance
    wallet = Wallet.objects.create(user=user)

    return Response(
        {
            "wallet_id": wallet.wallet_id,
            "user": wallet.user.username,
            "gems": wallet.gems,
        },
        status=status.HTTP_201_CREATED,
    )


# Add money to an existing wallet
@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
    responses={
        200: OpenApiResponse(
            description="Money added successfully",
            examples=[
                OpenApiExample(
                    "Money Added",
                    value={"wallet_id": 1, "user": "john_doe", "new_balance": 100.00},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Bad Request",
            examples=[
                OpenApiExample(
                    "Invalid Amount", value={"detail": "Amount must be greater than 0."}
                ),
                OpenApiExample(
                    "Insufficient Funds", value={"detail": "Insufficient funds."}
                ),
            ],
        ),
    },
)
@api_view(["POST"])
def addMoney(request, wallid):
    wallet = get_object_or_404(Wallet, wallet_id=wallid)
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
            "user": wallet.user.username,
            "new_balance": wallet.gems,
        }
    )


# Remove money from an existing wallet
@extend_schema(
    tags=["wallet"],  # Group under "wallet" tag
    responses={
        200: OpenApiResponse(
            description="Money removed successfully",
            examples=[
                OpenApiExample(
                    "Money Removed",
                    value={"wallet_id": 1, "user": "john_doe", "new_balance": 50.00},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Bad Request",
            examples=[
                OpenApiExample(
                    "Invalid Amount", value={"detail": "Amount must be greater than 0."}
                ),
                OpenApiExample(
                    "Insufficient Funds", value={"detail": "Insufficient funds."}
                ),
            ],
        ),
    },
)
@api_view(["POST"])
def removeMoney(request, wallid):
    wallet = get_object_or_404(Wallet, wallet_id=wallid)
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
            "user": wallet.user.username,
            "new_balance": wallet.gems,
        }
    )
