from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views

app_name = "home"
urlpatterns = [
    path('api/home/showcased', views.get_showcased, name='showcased'),
    path('api/home/countriesCities', views.get_countries_cities, name='countriesCities')
]