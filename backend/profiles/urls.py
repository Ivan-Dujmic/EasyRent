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
    path(
        "company/log/completed",
        views.completedCompanyRents,
        name="completedCompanyRents",
    ),
    path("company/reviews", views.companyReviews, name="companyReviews"),
    path("company/earnings", views.companyEarnings, name="companyEarnings"),
    path("company/info", views.companyInfo, name="companyInfo"),
    path("company/pass", views.companyPasswordChange, name="companyPasswordChange"),
    path("company/locations", views.companyLocations, name="companyLocations"),
    path("company/setHQ", views.companySetHQ, name="companySetHQ"),
    path("company/location", views.companyLocations, name="companyLocations"),
    path("company/delete", views.deleteCompany, name="companyDelete"),
    path("company/vehicles/edit-vehicle", views.companyVehicleEdit, name="editVehicle"),
    path("company/vehicle", views.companyVehicle, name="companyVehicle"),
]
