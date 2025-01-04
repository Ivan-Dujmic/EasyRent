from rest_framework import serializers
from .models import *
from src.models import *
from home.models import *
import base64

class RegisterCompanySerializer(serializers.Serializer):
    email = serializers.EmailField()
    companyName = serializers.CharField()
    tin = serializers.CharField()
    password = serializers.CharField()
    phoneNo = serializers.CharField()
    address = serializers.CharField()
    description = serializers.CharField()
    image = serializers.CharField()