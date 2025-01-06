from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views

app_name = "home"
urlpatterns = [
    path('offer/<offer_id>/', views.getOfferDetails, name='offerDetails'),
    path('showcased/', views.get_showcased, name='showcased'),
    path('locations/', views.getLocations, name='locations'),
    path('models/', views.getModels, name='models'),
    path('company/<dealership_id>/', views.getCompany, name='getCompany'),
]