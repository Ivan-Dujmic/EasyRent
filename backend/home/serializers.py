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

    companyName = serializers.CharField(source='dealer.companyName')
    modelName = serializers.CharField(source='model.modelName')
    makeName = serializers.CharField(source='model.makeName')
    noOfSeats = serializers.IntegerField(source='model.noOfSeats')
    automatic = serializers.BooleanField(source='model.automatic')

    class Meta:
        model = Offer
        fields = ['image', 'companyName', 'modelName', 'makeName', 'noOfSeats', 'automatic', 'price', 'rating', 'noOfReviews']

    def get_image(self, obj):
        if obj.image:
            return base64.b64decode(obj.image).decode('utf-8')
        