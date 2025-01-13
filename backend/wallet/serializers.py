from rest_framework import serializers
from drf_spectacular.utils import OpenApiExample


class AddMoneySerializer(serializers.Serializer):
    amount = serializers.FloatField()


class RemoveMoneySerializer(serializers.Serializer):
    amount = serializers.FloatField()


class OfferSerializer(serializers.Serializer):
    # buyer_id = serializers.IntegerField(default=1)
    paymentMethod = serializers.CharField(default="stripe/wallet")
    dateFrom = serializers.DateField(default="21-01-2025")
    dateTo = serializers.DateField(default="23-01-2025")
    pickupTime = serializers.IntegerField(default=0)
    dropoffTime = serializers.IntegerField(default=0)


class BuyGemsSerializer(serializers.Serializer):
    amount = serializers.IntegerField(default=0)
