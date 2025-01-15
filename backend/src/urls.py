from django.urls import path
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from . import views

app_name = "src"
urlpatterns = [
    path("register-user/", csrf_exempt(views.registerUser), name="registerUser"),
    path(
        "register-company/", csrf_exempt(views.registerCompany), name="registerCompany"
    ),
    path("logout/", views.logoutUser, name="logoutUser"),
    path("login/", csrf_exempt(views.loginUser), name="loginUser"),
    path("user-info/", views.userInfo, name="userInfo"),
    path("activate/<uidb64>/<token>/", views.activate, name="activateUser"),
    path("", views.redirectHome, name="redirectHome"),
    path("SuccessfulLogin", views.redirectHome, name="redirectHome"),
]
