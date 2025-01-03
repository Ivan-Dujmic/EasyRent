from rest_framework import serializers
from .models import *
from home.models import *
import base64


class OfferDetailsSerializer(serializers.Serializer):
    image = serializers.CharField(default="base64")
    makeName = serializers.CharField()
    modelName = serializers.CharField()
    companyName = serializers.CharField()
    dealership_id = serializers.IntegerField()
    noOfSeats = serializers.IntegerField()
    modelType = serializers.CharField()
    automatic = serializers.BooleanField()
    price = serializers.FloatField(default=0.1)
    rating = serializers.FloatField(default=0.1)
    noOfReviews = serializers.IntegerField()
    companyLogo = serializers.CharField(default="base64")
    description = serializers.CharField()
    canReview = serializers.IntegerField()