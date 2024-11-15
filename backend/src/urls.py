from django.urls import path
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from . import views

app_name = "src"
urlpatterns = [
    path("api/auth/registerUser/", csrf_exempt(views.registerUser), name="registerUser"),
    path("api/auth/registerCompany/", csrf_exempt(views.registerCompany), name="registerCompany"),
    path("api/auth/logoutUser/", views.logoutUser, name="logoutUser"),
    path("api/auth/loginUser/", csrf_exempt(views.loginUser), name="loginUser"),
    path('activate/<uidb64>/<token>/', views.activate, name="activateUser"),
    path("", views.redirectHome, name="redirectHome")
]
