from rest_framework import serializers
from .models import *
from home.models import *
import base64


class DealershipLogoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Dealership
        fields = ['companyName', 'image']

    def get_image(self, obj):
        if obj.image:
            return base64.b64decode(obj.image).decode('utf-8')


class OfferCardSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    companyName = serializers.CharField(source='dealerID.companyName')
    modelName = serializers.CharField(source='modelID.modelName')
    makeName = serializers.CharField(source='modelID.makeName')
    noOfSeats = serializers.IntegerField(source='modelID.noOfSeats')
    automatic = serializers.BooleanField(source='modelID.automatic')

    class Meta:
        model = Offer
        fields = ['image', 'companyName', 'modelName', 'makeName', 'noOfSeats', 'automatic', 'price', 'rating', 'noOfReviews']

    def get_image(self, obj):
        if obj.image:
            return base64.b64decode(obj.image).decode('utf-8')


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['cityName']


class CountryCitySerializer(serializers.ModelSerializer):
    cities = CitySerializer(source='city_set', many=True)

    class Meta:
        model = Country
        fields = ['countryName', 'cities']