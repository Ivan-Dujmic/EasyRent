from django.urls import path
from . import views

urlpatterns = [
	path("", views.mainPage, name = "main_page"),
	path("login/", views.login, name = "login"),
	path("register/", views.register, name = "register"),
	path("profile/", views.profile, name = "profile"),
	path("car/", views.car, name = "cars"),
]
