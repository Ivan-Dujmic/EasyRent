from django.contrib import admin
from .models import *
from home.models import *

# auth models
admin.site.register(
    [Rentoid, Dealership, Location, WorkingHours]
)
# home models
admin.site.register([ModelType, Model, Offer, Vehicle])
