from django.db import IntegrityError
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.db.models import Max
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout, authenticate, login, get_user_model
from backend.settings import DEFAULT_FROM_EMAIL
from .models import *
from wallet.models import Wallet
import json
from django.views.decorators.csrf import csrf_exempt
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
import datetime
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiResponse,
    OpenApiExample,
)
from PIL import Image


@csrf_exempt
def getCSRF(request):
    return JsonResponse({"csrfToken": get_token(request)})


def activate(request, uidb64, token):
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse("Email confirmed!")
    return HttpResponse("Email confirmation failed!")


def activateEmail(request, user, toEmail):
    subject = "Activate EasyRent account"
    message = render_to_string(
        "templateActivateAccount.html",
        {
            "domain": get_current_site(request).domain,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "protocol": "https" if request.is_secure() else "http",
        },
    )
    email = EmailMessage(subject, message, from_email=DEFAULT_FROM_EMAIL, to=[toEmail])

    try:
        email.send()
        print("Email sent!")
        return 1
    except Exception as e:
        print("Sending failed!", e)
        return 0


@extend_schema(
    methods=["POST"],
    operation_id="register_user",
    tags=["auth"],
    request=RegisterUserSerializer,
    responses={
        200: OpenApiResponse(
            description="Email confirmation request sent",
            examples=[
                OpenApiExample(
                    "Email confirmation request sent",
                    value={"success": 1, "message": "Email confirmation request sent"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Bad Request",
            examples=[
                OpenApiExample(
                    "All fields are required",
                    value={"success": 0, "message": "All fields are required."},
                ),
                OpenApiExample(
                    "Email already registered",
                    value={"success": 0, "message": "Email already registered."},
                ),
                OpenApiExample(
                    "Phone number must contain only digits",
                    value={
                        "success": 0,
                        "message": "Phone number must contain only digits.",
                    },
                ),
                OpenApiExample(
                    "Phone number too long",
                    value={"success": 0, "message": "Phone number too long."},
                ),
                OpenApiExample(
                    "Driver's license number too long",
                    value={
                        "success": 0,
                        "message": "Driver's license number too long.",
                    },
                ),
            ],
        ),
        500: OpenApiResponse(
            description="Email confirmation request failed",
            examples=[
                OpenApiExample(
                    "Email confirmation request failed",
                    value={
                        "success": 0,
                        "message": "Email confirmation request failed",
                    },
                ),
            ],
        ),
    },
)
@api_view(["POST"])
@csrf_exempt
def registerUser(request):
    if request.method == "POST":
        data = request.data

        email = data.get("email")
        firstName = data.get("firstName")
        lastName = data.get("lastName")
        driversLicense = data.get("driversLicense")
        phoneNo = data.get("phoneNo")
        password = data.get("password")

        if (
            not email
            or not firstName
            or not lastName
            or not driversLicense
            or not phoneNo
            or not password
        ):
            return JsonResponse(
                {"success": 0, "message": "All fields are required."}, status=400
            )
        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"success": 0, "message": "Email already registered."}, status=400
            )

        if not phoneNo.isdigit():
            return JsonResponse(
                {"success": 0, "message": "Phone number must contain only digits."},
                status=400,
            )
        if len(phoneNo) > 20:
            return JsonResponse(
                {"success": 0, "message": "Phone number too long."}, status=400
            )
        if len(driversLicense) > 16:
            return JsonResponse(
                {"success": 0, "message": "Driver's license number too long."},
                status=400,
            )

        username = "user_" + email
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=firstName,
            last_name=lastName,
        )
        user.is_active = False
        user.save()
        rentoid = Rentoid.objects.create(
            user=user, phoneNo=phoneNo, driversLicenseNo=driversLicense
        )
        Wallet.objects.create(rentoid=rentoid)
        if activateEmail(request, user, email):
            return JsonResponse(
                {"success": 1, "message": "Email confirmation request sent"}, status=200
            )
        else:
            user.delete()
            rentoid.delete()
            return JsonResponse(
                {"success": 0, "message": "Email confirmation request failed"},
                status=500,
            )


@extend_schema(
    methods=["POST"],
    operation_id="register_company",
    tags=["auth"],
    request=RegisterCompanySerializer,
    responses={
        200: OpenApiResponse(
            description="Email confirmation request sent",
            examples=[
                OpenApiExample(
                    "Email confirmation request sent",
                    value={"success": 1, "message": "Email confirmation request sent"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Bad Request",
            examples=[
                OpenApiExample(
                    "All fields are required",
                    value={"success": 0, "message": "All fields are required."},
                ),
                OpenApiExample(
                    "Email already registered",
                    value={"success": 0, "message": "Email already registered."},
                ),
                OpenApiExample(
                    "Phone number too long",
                    value={"success": 0, "message": "Phone number too long."},
                ),
                OpenApiExample(
                    "TIN too long",
                    value={"success": 0, "message": "TIN too long."},
                ),
                OpenApiExample(
                    "Company logo file size too large",
                    value={
                        "success": 0,
                        "message": "Company logo file size too large.",
                    },
                ),
                OpenApiExample(
                    "Invalid file type for company logo",
                    value={
                        "success": 0,
                        "message": "Invalid file type for company logo.",
                    },
                ),
                OpenApiExample(
                    "Invalid image file",
                    value={"success": 0, "message": "Invalid image file."},
                ),
                OpenApiExample(
                    "Working hours must be a list",
                    value={"success": 0, "message": "Working hours must be a list."},
                ),
                OpenApiExample(
                    "Each working hour entry must be a dictionary",
                    value={
                        "success": 0,
                        "message": "Each working hour entry must be a dictionary.",
                    },
                ),
                OpenApiExample(
                    "Invalid day",
                    value={"success": 0, "message": "Invalid day: {day}"},
                ),
                OpenApiExample(
                    "Start time and end time are required",
                    value={
                        "success": 0,
                        "message": "Start time and end time are required.",
                    },
                ),
                OpenApiExample(
                    "End time must be after start time",
                    value={
                        "success": 0,
                        "message": "End time must be after start time.",
                    },
                ),
                OpenApiExample(
                    "Invalid JSON for working hours",
                    value={"success": 0, "message": "Invalid JSON for working hours."},
                ),
                OpenApiExample(
                    "Location with these details already exists",
                    value={
                        "success": 0,
                        "message": "Location with these details already exists.",
                    },
                ),
            ],
        ),
        500: OpenApiResponse(
            description="Email confirmation request failed",
            examples=[
                OpenApiExample(
                    "Email confirmation request failed",
                    value={
                        "success": 0,
                        "message": "Email confirmation request failed",
                    },
                ),
            ],
        ),
    },
)
@api_view(["POST"])
@csrf_exempt
def registerCompany(request):
    if request.method == "POST":
        data = request.data
        print(data)
        email = data.get("email")
        companyName = data.get("companyName")
        tin = data.get("tin")
        phoneNo = data.get("phoneNo")
        countryName = data.get("countryName")
        cityName = data.get("cityName")
        streetName = data.get("streetName")
        streetNo = data.get("streetNo")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        workingHours = data.get("workingHours")
        description = data.get("description")
        password = data.get("password")
        companyLogo = request.FILES.get("companyLogo")

        if (
            not email
            or not companyName
            or not tin
            or not phoneNo
            or not countryName
            or not cityName
            or not streetName
            or not streetNo
            or not latitude
            or not longitude
            # or not workingHours
            or not description
            or not password
            # or not companyLogo
        ):
            return JsonResponse(
                {"success": 0, "message": "All fields are required."}, status=400
            )
        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"success": 0, "message": "Email already registered."}, status=400
            )
        if len(phoneNo) > 20:
            return JsonResponse(
                {"success": 0, "message": "Phone number too long."}, status=400
            )
        if len(tin) > 16:
            return JsonResponse({"success": 0, "message": "TIN too long."}, status=400)

        # if companyLogo:
        #     if companyLogo.size > 10 * 1024 * 1024:  # 10MB limit
        #         return JsonResponse(
        #             {"success": 0, "message": "Company logo file size too large."},
        #             status=400,
        #         )
        #     if not companyLogo.content_type.startswith("image/"):
        #         return JsonResponse(
        #             {"success": 0, "message": "Invalid file type for company logo."},
        #             status=400,
        #         )
        # try:
        #     image = Image.open(companyLogo)
        #     image.verify()
        # except (ImportError, Exception) as e:
        #     return JsonResponse(
        #         {"success": 0, "message": "Invalid image file."}, status=400
        #     )

        # try:
        #     workingHours = json.loads(workingHours)
        #     if not isinstance(workingHours, list):
        #         return JsonResponse(
        #             {"success": 0, "message": "Working hours must be a list."},
        #             status=400,
        #         )
        #     valid_days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}
        #     for day_info in workingHours:
        #         if not isinstance(day_info, dict):
        #             return JsonResponse(
        #                 {
        #                     "success": 0,
        #                     "message": "Each working hour entry must be a dictionary.",
        #                 },
        #                 status=400,
        #             )
        #         day = day_info.get("day")
        #         startTime = day_info.get("startTime")
        #         endTime = day_info.get("endTime")
        #         if day not in valid_days:
        #             return JsonResponse(
        #                 {"success": 0, "message": f"Invalid day: {day}"}, status=400
        #             )
        #         if not startTime or not endTime:
        #             return JsonResponse(
        #                 {
        #                     "success": 0,
        #                     "message": "Start time and end time are required.",
        #                 },
        #                 status=400,
        #             )
        #         if startTime >= endTime:
        #             return JsonResponse(
        #                 {"success": 0, "message": "End time must be after start time."},
        #                 status=400,
        #             )
        # except json.JSONDecodeError:
        #     return JsonResponse(
        #         {"success": 0, "message": "Invalid JSON for working hours."}, status=400
        #     )

        user = User.objects.create_user(
            username="company_" + email,
            email=email,
            password=password,
            first_name=companyName,
            last_name="",
        )
        user.is_active = False  # User must confirm email
        user.save()
        dealership = Dealership.objects.create(
            user=user,
            phoneNo=phoneNo,
            TIN=tin,
            description=description,
            # companyLogo=companyLogo,
        )

        try:
            location = Location.objects.create(
                countryName=countryName,
                cityName=cityName,
                streetName=streetName,
                streetNo=streetNo,
                latitude=latitude,
                longitude=longitude,
                dealership=dealership,
                isHQ=True,
            )
        except IntegrityError:
            user.delete()
            dealership.delete()
            return JsonResponse(
                {
                    "success": 0,
                    "message": "Location with these details already exists.",
                },
                status=400,
            )

        # for day_info in workingHours:
        #     day = day_info.get("day")
        #     startTime = day_info.get("startTime")
        #     endTime = day_info.get("endTime")
        #     workingHoursObject = WorkingHours.objects.create(
        #         location=location,
        #         dayOfTheWeek=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].index(
        #             day
        #         ),
        #         startTime=startTime,
        #         endTime=endTime,
        #     )

        if activateEmail(request, user, email):
            return JsonResponse(
                {"success": 1, "message": "Email confirmation request sent"}, status=200
            )
        else:
            user.delete()
            dealership.delete()
            # workingHoursObject.delete()
            return JsonResponse(
                {"success": 0, "message": "Email confirmation request failed"},
                status=500,
            )


@extend_schema(
    methods=["POST"],
    operation_id="logout_user",
    tags=["auth"],
    request=None,
    responses={
        200: OpenApiResponse(
            description="Logged out",
            examples=[
                OpenApiExample(
                    "Logged out",
                    value={"success": 1, "message": "Logged out"},
                ),
            ],
        ),
    },
)
@api_view(["POST"])
@csrf_exempt
def logoutUser(request):
    # print(request.COOKIES)
    if request.method == "POST":
        logout(request)
        response = JsonResponse({"success": 1, "message": "Logged out"}, status=200)

        return response


@extend_schema(
    methods=["POST"],
    operation_id="login_user",
    tags=["auth"],
    request=LoginUserSerializer,
    responses={
        200: OpenApiResponse(
            description="Logged in",
            examples=[
                OpenApiExample(
                    "Logged in",
                    value={"success": 1, "message": "Logged in"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Bad Request",
            examples=[
                OpenApiExample(
                    "All fields are required",
                    value={"success": 0, "message": "All fields are required."},
                ),
                OpenApiExample(
                    "Invalid email",
                    value={"message": "Invalid email"},
                ),
            ],
        ),
        403: OpenApiResponse(
            description="Forbidden",
            examples=[
                OpenApiExample(
                    "Awaiting email confirmation",
                    value={"success": 0, "message:": "Awaiting email confirmation"},
                ),
                OpenApiExample(
                    "Company registration has to be approved by an admin",
                    value={
                        "success": 0,
                        "message": "Company registration has to be approved by an admin",
                    },
                ),
                OpenApiExample(
                    "Invalid password",
                    value={"success": 0, "message": "Invalid password"},
                ),
            ],
        ),
    },
)
@api_view(["POST"])
@csrf_exempt
def loginUser(request):
    if request.method == "POST":
        data = request.data
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return JsonResponse(
                {"success": 0, "message": "All fields are required."}, status=400
            )
        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return JsonResponse(
                    {"success": 0, "message:": "Awaiting email confirmation"},
                    status=403,
                )
            username = user.username
            user = authenticate(request, username=username, password=password)
            if user is not None:
                try:  # Try to find dealership because a dealership has to be approved by an admin
                    dealership = Dealership.objects.get(user=user.id)
                    if dealership.isAccepted:
                        login(request, user)
                        return JsonResponse(
                            {"success": 1, "message": "Logged in"}, status=200
                        )
                    else:
                        return JsonResponse(
                            {
                                "success": 0,
                                "message": "Company registration has to be approved by an admin",
                            },
                            status=403,
                        )
                except Dealership.DoesNotExist:  # User is not a company
                    login(request, user)
                    return JsonResponse(
                        {"success": 1, "message": "Logged in"}, status=200
                    )
            else:
                return JsonResponse(
                    {"success": 0, "message": "Invalid password"}, status=403
                )
        except User.DoesNotExist:
            return JsonResponse({"message": "Invalid email"}, status=400)


@extend_schema(
    methods=["GET"],
    operation_id="user_info",
    tags=["auth"],
    responses={
        200: UserInfoSerializer,
        500: OpenApiResponse(
            description="No rentoid or dealership to match user",
            examples=[
                OpenApiExample(
                    "No rentoid or dealership to match user",
                    value={
                        "success": 0,
                        "message": "No rentoid or dealership to match user",
                    },
                ),
            ],
        ),
    },
)
@api_view(["GET"])
@csrf_exempt
def userInfo(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            try:
                # Try to find rentoid
                rentoid = Rentoid.objects.get(user=request.user.id)
                return JsonResponse(
                    {
                        "role": "user",
                        "firstName": request.user.first_name,
                    },
                    status=200,
                )
            except Rentoid.DoesNotExist:
                # If Rentoid does not exist, try to find the Dealership
                try:
                    dealership = Dealership.objects.get(user=request.user.id)
                    return JsonResponse(
                        {
                            "role": "company",
                            "companyName": request.user.first_name,
                        },
                        status=200,
                    )
                except Dealership.DoesNotExist:
                    # If neither exists and user is authenticated, something has gone horribly wrong
                    return JsonResponse(
                        {
                            "success": 0,
                            "message": "No rentoid or dealership to match user",
                        },
                        status=500,
                    )
        else:
            return Response(
                {
                    "role": "guest",
                }
            )


@csrf_exempt
def redirectHome(request):
    # return redirect(https://easy-rent-ashy.vercel.app/home)
    return redirect("http://localhost:3000/home")


def googleLogin(request):
    session_key = request.COOKIES.get("sessionid")
    session = Session.objects.get(session_key=session_key)
    session_data = session.get_decoded()
    uid = session_data.get("_auth_user_id")
    cuser = User.objects.get(id=uid)
    cuser.username = "user_" + cuser.email
    cuser.save()
    try:
        rentoid = Rentoid.objects.get(user=cuser)
    except:
        rentoid = Rentoid.objects.create(
            user=cuser, phoneNo=6129945, driversLicenseNo=162862
        )
    # return redirect(https://easy-rent-ashy.vercel.app/home)
    return redirect("http://localhost:3000/home/")
    # ovo promjeniti -> napraviti novu front stranicu koja je samo dummy za redirect.
    # nek ta stranica onda redirecta na home page + posalje request za user info koji se dobija upravo kao u ovoj funckiji
