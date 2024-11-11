from rest_framework import serializers
from .models import *
from home.models import *


class DealershipLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealership
        fields = ['companyName', 'picturePath']


class OfferCardSerializer(serializers.ModelSerializer):
    companyName = serializers.CharField(source='dealerID.companyName')
    modelName = serializers.CharField(source='modelID.modelName')
    makeName = serializers.CharField(source='modelID.makeName')
    noOfSeats = serializers.IntegerField(source='modelID.noOfSeats')
    automatic = serializers.BooleanField(source='modelID.automatic')

    class Meta:
        model = Offer
        fields = ['picturePath', 'companyName', 'modelName', 'makeName', 'noOfSeats', 'automatic', 'price', 'rating', 'noOfReviews']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['cityName']


class CountryCitySerializer(serializers.ModelSerializer):
    cities = CitySerializer(source='city_set', many=True)

    class Meta:
        model = Country
        fields = ['countryName', 'cities']