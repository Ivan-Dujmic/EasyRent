from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.contrib.auth.models import User
from django.db.models import Max
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib.auth import logout, authenticate, login, get_user_model
from .models import *
import json
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from .forms import NewUserForm, NewCompanyForm
from .tokens import account_activation_token
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

def activate(request, uidb64, token):
	User = get_user_model()
	try:
		uid = force_str(urlsafe_base64_decode(uidb64))
		user = User.objects.get(pk=uid)
	except(TypeError, ValueError, OverflowError, User.DoesNotExist):
		user = None
	if user is not None and account_activation_token.check_token(user, token):
		user.is_active = True
		user.save()
		return render("Email confirmed!")
	return render("Email confirmation failed!")

def activateEmail(request, user, toEmail):
    subject = "Activate EasyRent account"
    message = render_to_string("templateActivateAccount.html", {
        "domain": get_current_site(request).domain,
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": account_activation_token.make_token(user),
        "protocol": "https" if request.is_secure() else "http"
    })
    email = EmailMessage(subject, message, to=[toEmail])
    if email.send():
        print("Email sent!")
        return 1
    else:
        print("Sending failed!")
        return 0

def registerUser(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = "user" + str(User.objects.aggregate(Max("id"))["id__max"] + 1)
            email = data.get("email")
            password = data.get("password")
            if  not email or not password:
                return JsonResponse({"error": "All fields (username, email, password) are required."}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered."}, status=400)
            user = User.objects.create_user(username=username, email=email, password=password)
            user.is_active = False
            user.save()
            if (activateEmail(request, user, email)):
                return JsonResponse({"success": 1},status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

def registerCompany(request):
    if request.method == "POST":
        registerForm = NewCompanyForm(request.POST)
        if registerForm.is_valid():
            user = registerForm.save(commit = False)
            user.is_active = False
            user.save()
            activateEmail(request, user, registerForm.cleaned_data.get("email"))
            # username = registerForm.cleaned_data.get("username")
            # login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            return redirect("src:home")

        else:
            return redirect("src:registerUser")

def logoutUser(request):
    logout(request)
    return JsonResponse({"success": 1}, status=200)


def loginUser(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        if  not email or not password:
            return JsonResponse({"error": "All fields (username, email, password) are required."}, status=400)
        try:
            user = User.objects.get(email=email)
            username = user.username
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({
                                'success': 1,
                                'name': user.first_name
                            }, status=200)
            else:
                return JsonResponse({'success': 0}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'message': 'Invalid credentials'}, status=400)


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
