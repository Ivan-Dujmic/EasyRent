from rest_framework import serializers
from .models import *
from home.models import *
import base64


#Serializer only used for example response in SwaggerUI
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


class DealershipLogoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    companyName = serializers.CharField(source='user.first_name')
    class Meta:
        model = Dealership
        fields = ['companyName', 'image']

    def get_image(self, obj):
        if obj.image:
            return base64.b64encode(obj.image).decode('utf-8')


class OfferCardSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    companyName = serializers.CharField(source='dealer.user.first_name')
    modelName = serializers.CharField(source='model.modelName')
    makeName = serializers.CharField(source='model.makeName')
    noOfSeats = serializers.IntegerField(source='model.noOfSeats')
    automatic = serializers.BooleanField(source='model.automatic')

    class Meta:
        model = Offer
        fields = ['image', 'companyName', 'modelName', 'makeName', 'noOfSeats', 'automatic', 'price', 'rating', 'noOfReviews']

    def get_image(self, obj):
        if obj.image:
            return base64.b64encode(obj.image).decode('utf-8')