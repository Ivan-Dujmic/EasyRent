from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views

app_name = "profiles"
urlpatterns = [
    path("user/rentals/", views.userRentals, name="userRentals"),
    path("user/info/", views.userInfo, name="userInfo"),
    path("user/pass/", views.userPass, name="userPass"),
    path("user/delete/", views.userDelete, name="userDelete"),
    path("company/vehicles", views.companyVehicles, name="companyVehicles"),
    path(
        "company/toggle-vehicle-visibility",
        views.toogleVehicleVisibility,
        name="toggleVehicleVisibility",
    ),
    path(
        "company/log/upcoming", views.upcomingCompanyRents, name="upcomingCompanyRents"
    ),
    path("company/log/ongoing", views.ongoingCompanyRents, name="ongoingCompanyRents"),
]
