from rest_framework import serializers
from .models import *
from src.models import *
from home.models import *

class RegisterUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    driversLicense = serializers.CharField()
    phoneNo = serializers.CharField()
    password = serializers.CharField()

class WorkingHoursSerializer(serializers.Serializer):
    day = serializers.CharField(default="mon=monday, leave out the day if the dealership is closed")
    startTime = serializers.CharField()
    endTime = serializers.CharField()

class RegisterCompanySerializer(serializers.Serializer):
    email = serializers.EmailField()
    companyName = serializers.CharField()
    tin = serializers.CharField()
    password = serializers.CharField()
    phoneNo = serializers.CharField()
    countryName = serializers.CharField()
    cityName = serializers.CharField()
    streetName = serializers.CharField()
    streetNo = serializers.CharField()
    latitude = serializers.DecimalField(default=0.1, max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(default=0.1, max_digits=9, decimal_places=6)
    workingHours = serializers.ListField(
        child=WorkingHoursSerializer()
    )
    description = serializers.CharField()
    password = serializers.CharField()
    image = serializers.ImageField(default="IMAGE")

class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserInfoSerializer(serializers.Serializer):
    role = serializers.CharField(default="guest/user/company")
    firstName = serializers.CharField(default="name if not guest, balance only for user")
    lastName = serializers.CharField(default="last name if not guest")
    balance = serializers.DecimalField(max_digits=10, decimal_places=2, default=1.00)