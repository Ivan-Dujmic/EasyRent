from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout, authenticate, login
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from .forms import NewUserForm


def home(request):
    return render(
        request=request,
        template_name="home.html",
    )


def registerUser(request):
    form = NewUserForm
    if request.method == "GET":
        return render(
            request=request, template_name="register.html", context={"form": form}
        )
    elif request.method == "POST":
        registerForm = NewUserForm(request.POST)
        if registerForm.is_valid():
            user = registerForm.save()
            username = registerForm.cleaned_data.get("username")
            login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            return redirect("src:home")

        else:
            return redirect("src:registerUser")


def logoutUser(request):
    logout(request)
    return redirect("src:home")


def loginUser(request):
    if request.method == "GET":
        loginForm = AuthenticationForm()
        return render(
            request=request, template_name="login.html", context={"form": loginForm}
        )
    elif request.method == "POST":
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("/")
            else:
                messages.error(request, "Invalid username or password.")
        else:
            return redirect("src:home")


def userProfile():
    return


def companyProfile():
    return


@api_view(["GET"])
def getDealershipInfo(request):
    dealership = Dealership.objects.get(id=1)
    serializer = UserViewDealershipSerializer(
        dealership, many=False
    )  # we are only returning one dealership so many = False
    if request.method == "GET":
        return Response({"dealership": serializer.data})
    return


def profile(request):
    # based on content of request redirect to user/company
    userProfile()
    companyProfile()
    return


def car(request):
    return
