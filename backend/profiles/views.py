from datetime import timedelta
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django import forms
import random
from .models import *
from .serializers import *
from src.models import *
from home.models import *
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.utils.timezone import now
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiExample


@extend_schema(
    tags=['profile'],
    operation_id='get_user_rentals',
    responses={
        200: GetUserRentalsSerializer(many=True),
        401: OpenApiResponse(
            description='User not authenticated',
            examples=[
                OpenApiExample(
                    'User not authenticated',
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
    },
)
@api_view(['GET'])
def userRentals(request):
    if request.method == 'GET':
        user = request.user
        if user.is_authenticated:
            rentoid = Rentoid.objects.get(user=user)
            rentals = Rent.objects.filter(rentoid=rentoid.rentoid_id)
            rentalData = []
            for rental in rentals:
                vehicle = rental.vehicle
                dealer = vehicle.location.dealership
                offer = Offer.objects.filter(dealer=dealer, model=vehicle.model).first()
                model = offer.model
                
                item = {
                    "makeName": model.makeName,
                    "modelName": model.modelName,
                    "companyName": dealer.user.first_name,
                    "noOfSeats": model.noOfSeats,
                    "automatic": model.automatic,
                    "price": offer.price,
                    "rating": offer.rating,
                    "noOfReviews": offer.noOfReviews,
                    "dateTimeRented": rental.dateTimeRented,
                    "dateTimeReturned": rental.dateTimeReturned,
                    "expired": isUserRentalExpired(rental),
                    "canReview": canUserReview(user, rental),
                    "offer_id": offer.offer_id,
                    "image": offer.image.url if offer.image else None,
                }

                rentalData.append(item)
                rentalData.sort(key=lambda x: x['dateTimeRented'])

            return Response(rentalData, status=200)
        else:
            return Response({"success": 0, "message": "User not authenticated"}, status=401)
    
    
def isUserRentalExpired(rental):
    return rental.dateTimeReturned < now()


def canUserReview(user, rental):
    oneMonthAfterExpiry = rental.dateTimeReturned + timedelta(days=30)
    hasReviewed = Review.objects.filter(user=user, rental=rental).exists()
    return rental.dateTimeReturned < now() and not hasReviewed and now() <= oneMonthAfterExpiry


@extend_schema(
    methods=['GET'],
    operation_id='get_user_info',
    tags=['profile'],
    responses={
        200: GetUserInfoSerializer,
        401: OpenApiResponse(
            description='User not authenticated',
            examples=[
                OpenApiExample(
                    'User not authenticated',
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
    },
)
@extend_schema(
    methods=['PUT'],
    operation_id='update_user_info',
    tags=['profile'],
    request=PutUserInfoSerializer,
    responses={
        200: OpenApiResponse(
            description='User info updated successfully',
            examples=[
                OpenApiExample(
                    'User info updated successfully',
                    value={"success": 1, "message": "User info updated successfully"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description='Invalid input',
            examples=[
                OpenApiExample(
                    'All fields are required',
                    value={"success": 0, "message": "All fields are required"},
                ),
                OpenApiExample(
                    'Phone number must contain only digits',
                    value={"success": 0, "message": "Phone number must contain only digits"},
                ),
                OpenApiExample(
                    'Phone number must be at most 20 characters long',
                    value={"success": 0, "message": "Phone number must be at most 20 characters long"},
                ),
                OpenApiExample(
                    'Driver\'s license number must be at most 16 characters long',
                    value={"success": 0, "message": "Driver's license number must be at most 16 characters long"},
                ),
            ],
        ),
        401: OpenApiResponse(
            description='User not authenticated',
            examples=[
                OpenApiExample(
                    'User not authenticated',
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
        403: OpenApiResponse(
            description='Incorrect password',
            examples=[
                OpenApiExample(
                    'Incorrect password',
                    value={"success": 0, "message": "Incorrect password"},
                ),
            ],
        ),
    },
)
@api_view(['GET', 'PUT'])
def userInfo(request):
    if request.method == 'GET':
        user = request.user
        if user.is_authenticated:
            rentoid = Rentoid.objects.get(user=user)
            userInfo = {
                "firstName": user.first_name,
                "lastName": user.last_name,
                "phoneNo": rentoid.phoneNo,
                "driversLicense": rentoid.driversLicenseNo,
            }
            return Response(userInfo, status=200)
        else:
            return Response({"success": 0, "message": "User not authenticated"}, status=401)
    elif request.method == 'PUT':
        user = request.user
        if user.is_authenticated:
            rentoid = Rentoid.objects.get(user=user)
            data = request.data

            if not data["firstName"] or not data["lastName"] or not data["phoneNo"] or not data["driversLicense"]:
                return Response({"success": 0, "message": "All fields are required"}, status=400)
            
            if not data["phoneNo"].isdigit():
                return Response({"success": 0, "message": "Phone number must contain only digits"}, status=400)
            
            if len(data["phoneNo"]) > 20:
                return Response({"success": 0, "message": "Phone number must be at most 20 characters long"}, status=400)
            
            if len(data["driversLicense"]) > 16:
                return Response({"success": 0, "message": "Driver's license number must be at most 16 characters long"}, status=400)
            
            if not user.check_password(data["password"]):
                return Response({"success": 0, "message": "Incorrect password"}, status=403)
            
            user.first_name = data["firstName"]
            user.last_name = data["lastName"]
            
            rentoid.phoneNo = data["phoneNo"]
            rentoid.driversLicenseNo = data["driversLicense"]
            user.save()
            rentoid.save()
            return Response({"success": 1, "message": "User info updated successfully"}, status=200)
        else:
            return Response({"error": "User not authenticated"}, status=401)


@extend_schema(
    methods=['PUT'],
    operation_id='update_user_password',
    tags=['profile'],
    request=PutUserPasswordSerializer,
    responses={
        200: OpenApiResponse(
            description='Password updated successfully',
            examples=[
                OpenApiExample(
                    'Password updated successfully',
                    value={"success": 1, "message": "Password updated successfully"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description='Invalid input',
            examples=[
                OpenApiExample(
                    'All fields are required',
                    value={"success": 0, "message": "All fields are required"},
                ),
                OpenApiExample(
                    'New password must be at least 8 characters long',
                    value={"success": 0, "message": "New password must be at least 8 characters long"},
                ),
            ],
        ),
        401: OpenApiResponse(
            description='User not authenticated',
            examples=[
                OpenApiExample(
                    'User not authenticated',
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
        403: OpenApiResponse(
            description='Incorrect password',
            examples=[
                OpenApiExample(
                    'Incorrect password',
                    value={"success": 0, "message": "Incorrect password"},
                ),
            ],
        ),
    },
)
@api_view(['PUT'])
def userPass(request):
    if request.method == 'PUT':
        user = request.user
        if user.is_authenticated:
            data = request.data

            if not data["oldPassword"] or not data["newPassword"]:
                return Response({"success": 0, "message": "All fields are required"}, status=400)
            
            if len(data["newPassword"]) < 8:
                return Response({"success": 0, "message": "New password must be at least 8 characters long"}, status=400)
            
            if not user.check_password(data["oldPassword"]):
                return Response({"success": 0, "message": "Incorrect password"}, status=403)
            
            user.set_password(data["newPassword"])
            user.save()
            return Response({"success": 1, "message": "Password updated successfully"}, status=200)
        else:
            return Response({"success": 0, "message": "User not authenticated"}, status=401)
        

@extend_schema(
    methods=['DELETE'],
    operation_id='delete_user',
    tags=['profile'],
    request=DeleteUserSerializer,
    responses={
        200: OpenApiResponse(
            description='User deleted successfully',
            examples=[
                OpenApiExample(
                    'User deleted successfully',
                    value={"success": 1, "message": "User deleted successfully"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description='Password is required',
            examples=[
                OpenApiExample(
                    'Password is required',
                    value={"success": 0, "message": "Password is required"},
                ),
            ],
        ),
        401: OpenApiResponse(
            description='User not authenticated',
            examples=[
                OpenApiExample(
                    'User not authenticated',
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
        403: OpenApiResponse(
            description='Incorrect password',
            examples=[
                OpenApiExample(
                    'Incorrect password',
                    value={"success": 0, "message": "Incorrect password"},
                ),
            ],
        ),
    },
)
@api_view(['DELETE'])
def userDelete(request):
    if request.method == 'DELETE':
        user = request.user
        if user.is_authenticated:
            data = request.data

            if not data.get("password"):
                return Response({"success": 0, "message": "Password is required"}, status=400)
            
            if not user.check_password(data["password"]):
                return Response({"success": 0, "message": "Incorrect password"}, status=403)
            
            user.delete()
            return Response({"success": 1, "message": "User deleted successfully"}, status=200)
        else:
            return Response({"success": 0, "message": "User not authenticated"}, status=401)