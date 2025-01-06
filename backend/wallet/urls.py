from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views


app_name = "wallet"
urlpatterns = [
    path("wallet/addAccount/", views.addAccount, name="addAccount"),
    path("wallet/addMoney/<wallid>/", views.addMoney, name="addMoney"),
    path("wallet/removeMoney/<wallid>/", views.removeMoney, name="removeMoney"),
]
