from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views

app_name = "home"
urlpatterns = [
    path('offer/<offer_id>', views.getOfferDetails, name='offerDetails')
]