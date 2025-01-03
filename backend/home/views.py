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
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.utils.timezone import now
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiExample


#extend_schema has to come before api_view
#tag defines the category in SwaggerUI and responses are examples of responses that can be returned
@extend_schema(
    tags=['home'],
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
            "image": base64.b64encode(offer.image).decode('utf-8'),
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


@extend_schema(
    tags=['home'],
)
@api_view(["GET"])
def get_showcased(request):
    # Session debug
    # for session in sessions:
    #     if session.session_key == "e77fbr34a70emfsfow7veg5y1ifjst91":
    #         print(session.session_key, session.get_decoded())
    # for session in sessions:
    #     data = session.get_decoded()
    #     print(data)
    #     print("Session: ", session.session_key)
    # print("Trenutni: ", request.session.session_key)

    dealerships = list(Dealership.objects.all())
    size = 6 if len(dealerships) >= 6 else len(dealerships)
    showcased_dealerships = random.sample(dealerships, size)

    offers = Offer.objects.all()
    most_popular = offers.order_by("-noOfReviews")[:5]
    best_value = offers.order_by("price")[:5]

    showcased_dealership_data = DealershipLogoSerializer(
        showcased_dealerships, many=True
    ).data
    most_popular_data = OfferCardSerializer(most_popular, many=True).data
    best_value_data = OfferCardSerializer(best_value, many=True).data

    response_data = {
        "showcased_dealerships": showcased_dealership_data,
        "most_popular": most_popular_data,
        "best_value": best_value_data,
    }

    return Response(response_data)