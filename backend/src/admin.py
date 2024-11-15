from django.contrib import admin
from .models import *

admin.site.register(
    [Rentoid, Dealership, Location, WorkingHours]
)


