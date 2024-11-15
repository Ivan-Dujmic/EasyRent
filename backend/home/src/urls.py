from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
	path("", views.home, name="home"),
	path("profile/", views.profile, name = "profile"),
	path("car/", views.car, name = "cars"),
	# allauth for OAuth
]
