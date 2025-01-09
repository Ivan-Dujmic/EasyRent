from rest_framework import serializers
from drf_spectacular.utils import OpenApiExample


class AddMoneySerializer(serializers.Serializer):
    amount = serializers.FloatField()


class RemoveMoneySerializer(serializers.Serializer):
    amount = serializers.FloatField()


class OfferSerializer(serializers.Serializer):
    buyer_id = serializers.IntegerField(default=1)
    paymentMethod = serializers.CharField(default="stripe/wallet")
    dateFrom = serializers.DateTimeField(default="21-01-2025T16H")
    dateTo = serializers.DateTimeField(default="23-01-2025T18H")
