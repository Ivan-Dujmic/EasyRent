from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django import forms
import random
from .models import *
from .serializers import *
from src.models import *
from src.serializers import *
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiExample


@extend_schema(
    tags=['public'],
    responses={
        200: OfferDetailsSerializer,
        404: OpenApiResponse(
            description='Offer Not Found',
            examples=[
                OpenApiExample(
                    'Offer Not Found',
                    value={"error": "Offer not found"},
                ),
            ],
        ),
    },
)
@api_view(['GET'])
def getOfferDetails(request, offer_id):
    try:
        offer = Offer.objects.get(pk=offer_id)
        dealership = offer.dealer
        can_review = 1 if request.user.is_authenticated and user_can_review(request.user, offer) else 0

        response_data = {
            "image": base64.b64encode(offer.image).decode('utf-8'),  # Convert bytes to string
            "makeName": offer.model.makeName,
            "modelName": offer.model.modelName,
            "companyName": dealership.user.first_name,
            "dealership_id": dealership.dealership_id,
            "noOfSeats": offer.model.noOfSeats,
            "modelType": offer.model.modelType.modelTypeName,
            "automatic": offer.model.automatic,
            "price": offer.price,
            "rating": offer.rating,
            "noOfReviews": offer.noOfReviews,
            "companyLogo": base64.b64encode(dealership.image).decode('utf-8'),
            "description": offer.description,
            "canReview": can_review
        }

        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offer not found"}, status=404)

def user_can_review(user, offer):
    # Implement your logic to determine if the user can review the offer
    return True  # Placeholder logic