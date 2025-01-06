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


@extend_schema(
    tags=['home'],
    responses={
        200: LocationListSerializer,
        404: OpenApiResponse(
            description='Locations Not Found',
            examples=[
                OpenApiExample(
                    'Location Not Found',
                    value={"error": "Locations not found"},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
def getLocations(request):
    try:
        response_array = []
        locations = Location.objects.all()
        for location in locations:
            response_array.append({
            "companyName" : location.dealership.user.first_name,
            "dealership_id" : location.dealership.dealership_id,
            "streetName" : location.streetName,
            "streetNo" : location.streetNo,
            "cityName" : location.cityName,
            "latitude" : location.latitude,
            "longitude" : location.longitude
        })
        response_data = {"locations" : response_array}
        return JsonResponse(response_data, status=200)
    except Location.DoesNotExist:
        return Response({"error": "Locations not found"}, status=404)


@extend_schema(
    tags=['home'],
    responses={
        200: MakeModelListSerializer,
        404: OpenApiResponse(
            description='Makes Not Found',
            examples=[
                OpenApiExample(
                    'Makes Not Found',
                    value={"error": "Makes not found"},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
def getModels(request):
    try:
        makeModel = {}
        response_array = []
        makes = Model.objects.all()
        for make in makes:
            if not makeModel.__contains__(make.makeName):
                makeModel[make.makeName] = []
            makeModel[make.makeName].append({"modelName" : make.modelName, "model_id" : make.model_id})
        for makeName, modelList in makeModel.items():
            response_array.append({
                "makeName" : makeName,
                "models" : modelList 
            }
            )
        response_data = {"makes" : response_array}
        return JsonResponse(response_data, status=200)
    except Model.DoesNotExist:
        return Response({"error": "Makes not found"}, status=404)
    


@extend_schema(
    tags=['home'],
    responses={
        200: DealershipSerializer,
        404: OpenApiResponse(
            description='Company Not Found',
            examples=[
                OpenApiExample(
                    'Company Not Found',
                    value={"error": "Company not found"},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
def getCompany(request, dealership_id):
    try:
        response_data = {}
        if (dealership_id == None or not dealership_id.isdigit()):
            return Response({"error": "Company not found"}, status=404)
        company = Dealership.objects.get(pk = dealership_id)
        locations = Location.objects.filter(dealership_id = company.dealership_id).all()
        location_array = []
        for location in locations:
            location_array.append({
            "streetName" : location.streetName,
            "streetNo" : location.streetNo,
            "cityName" : location.cityName,
            "latitude" : location.latitude,
            "longitude" : location.longitude,
            "isHQ" : location.isHQ 
        })
        response_data = {
            "companyLogo" : base64.b64encode(company.image),
            "companyName" : company.user.first_name,
            "dealership_id" : company.dealership_id,
            "description" : company.description,
            "locations" : location_array
        }
        return JsonResponse(response_data, status=200)
    except Dealership.DoesNotExist:
        return Response({"error": "Company not found"}, status=404)
