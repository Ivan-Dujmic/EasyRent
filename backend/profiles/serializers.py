from rest_framework import serializers
from .models import *
from src.models import *
from home.models import *


class GetUserRentalsSerializer(serializers.Serializer):
    makeName = serializers.CharField()
    modelName = serializers.CharField()
    companyName = serializers.CharField()
    noOfSeats = serializers.IntegerField()
    automatic = serializers.BooleanField()
    price = serializers.FloatField(default=0.1)
    rating = serializers.FloatField(default=0.1)
    noOfReviews = serializers.IntegerField()
    dateTimeRented = serializers.DateTimeField()
    dateTimeReturned = serializers.DateTimeField()
    expired = serializers.BooleanField()
    canReview = serializers.BooleanField()
    offer_id = serializers.IntegerField()
    image = serializers.ImageField(example="IMAGE")

class GetUserInfoSerializer(serializers.Serializer):
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    phoneNo = serializers.CharField()
    driversLicense = serializers.CharField()

class PutUserInfoSerializer(serializers.Serializer):
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    phoneNo = serializers.CharField()
    driversLicense = serializers.CharField()
    password = serializers.CharField()

class PutUserPasswordSerializer(serializers.Serializer):
    oldPassword = serializers.CharField()
    newPassword = serializers.CharField()

class DeleteUserSerializer(serializers.Serializer):
    password = serializers.CharField()