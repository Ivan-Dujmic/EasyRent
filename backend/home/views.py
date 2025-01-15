from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django import forms
import random
from .models import *
from .serializers import *
from src.models import *
from src.serializers import *


@api_view(["GET"])
def get_showcased(request):
    print("Headers:")
    print(request.headers)
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
