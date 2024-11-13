from django.urls import path
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from . import views

app_name = "src"
urlpatterns = [
    path("registerUser/", csrf_exempt(views.registerUser), name="registerUser"),
    path("registerCompany/", views.registerCompany, name="registerCompany"),
    path("logoutUser/", views.logoutUser, name="logoutUser"),
    path("loginUser/", views.loginUser, name="loginUser"),
    path('activate/<uidb64>/<token>/', views.activate, name="activateUser"),
    path("profile/", views.profile, name="profile"),
    path("car/", views.car, name="cars"),
    path("getDealershipInfo/", views.getDealershipInfo, name="dealership-info"),
]
