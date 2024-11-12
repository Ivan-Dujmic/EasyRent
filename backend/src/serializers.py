from rest_framework import serializers
from .models import *

class UserViewDealershipSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dealership
        fields = ('companyName', 'description')

        #possible to add read only fields, can not be edited after they have been added, for example most PKs
        read_only_fields = []
