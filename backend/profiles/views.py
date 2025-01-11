from datetime import timedelta
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.decorators import *
from django import forms
from datetime import datetime
import random
from .models import *
from .serializers import *
from src.models import *
from home.models import *
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.utils.timezone import now
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiResponse,
    OpenApiExample,
)


@extend_schema(
    tags=["profile"],
    operation_id="get_user_rentals",
    responses={
        200: GetUserRentalsSerializer(many=True),
        401: OpenApiResponse(
            description="User not authenticated",
            examples=[
                OpenApiExample(
                    "User not authenticated",
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
def userRentals(request):
    if request.method == "GET":
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
                rentalData.sort(key=lambda x: x["dateTimeRented"])

            return Response(rentalData, status=200)
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


def isUserRentalExpired(rental):
    return rental.dateTimeReturned < now()


def canUserReview(user, rental):
    oneMonthAfterExpiry = rental.dateTimeReturned + timedelta(days=30)
    hasReviewed = Review.objects.filter(user=user, rental=rental).exists()
    return (
        rental.dateTimeReturned < now()
        and not hasReviewed
        and now() <= oneMonthAfterExpiry
    )


@extend_schema(
    methods=["GET"],
    operation_id="get_user_info",
    tags=["profile"],
    responses={
        200: GetUserInfoSerializer,
        401: OpenApiResponse(
            description="User not authenticated",
            examples=[
                OpenApiExample(
                    "User not authenticated",
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
    },
)
@extend_schema(
    methods=["PUT"],
    operation_id="update_user_info",
    tags=["profile"],
    request=PutUserInfoSerializer,
    responses={
        200: OpenApiResponse(
            description="User info updated successfully",
            examples=[
                OpenApiExample(
                    "User info updated successfully",
                    value={"success": 1, "message": "User info updated successfully"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Invalid input",
            examples=[
                OpenApiExample(
                    "All fields are required",
                    value={"success": 0, "message": "All fields are required"},
                ),
                OpenApiExample(
                    "Phone number must contain only digits",
                    value={
                        "success": 0,
                        "message": "Phone number must contain only digits",
                    },
                ),
                OpenApiExample(
                    "Phone number must be at most 20 characters long",
                    value={
                        "success": 0,
                        "message": "Phone number must be at most 20 characters long",
                    },
                ),
                OpenApiExample(
                    "Driver's license number must be at most 16 characters long",
                    value={
                        "success": 0,
                        "message": "Driver's license number must be at most 16 characters long",
                    },
                ),
            ],
        ),
        401: OpenApiResponse(
            description="User not authenticated",
            examples=[
                OpenApiExample(
                    "User not authenticated",
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
        403: OpenApiResponse(
            description="Incorrect password",
            examples=[
                OpenApiExample(
                    "Incorrect password",
                    value={"success": 0, "message": "Incorrect password"},
                ),
            ],
        ),
    },
)
@api_view(["GET", "PUT"])
def userInfo(request):
    if request.method == "GET":
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
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    elif request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            rentoid = Rentoid.objects.get(user=user)
            data = request.data

            if (
                not data.get("firstName")
                or not data.get("lastName")
                or not data.get("phoneNo")
                or not data.get("driversLicense")
            ):
                return Response(
                    {"success": 0, "message": "All fields are required"}, status=400
                )

            if not data.get("phoneNo").isdigit():
                return Response(
                    {"success": 0, "message": "Phone number must contain only digits"},
                    status=400,
                )

            if len(data.get("phoneNo")) > 20:
                return Response(
                    {
                        "success": 0,
                        "message": "Phone number must be at most 20 characters long",
                    },
                    status=400,
                )

            if len(data.get("driversLicense")) > 16:
                return Response(
                    {
                        "success": 0,
                        "message": "Driver's license number must be at most 16 characters long",
                    },
                    status=400,
                )

            if not user.check_password(data.get("password")):
                return Response(
                    {"success": 0, "message": "Incorrect password"}, status=403
                )

            user.first_name = data.get("firstName")
            user.last_name = data.get("lastName")

            rentoid.phoneNo = data.get("phoneNo")
            rentoid.driversLicenseNo = data.get("driversLicense")
            user.save()
            rentoid.save()
            return Response(
                {"success": 1, "message": "User info updated successfully"}, status=200
            )
        else:
            return Response({"error": "User not authenticated"}, status=401)


@extend_schema(
    methods=["PUT"],
    operation_id="update_user_password",
    tags=["profile"],
    request=PutUserPasswordSerializer,
    responses={
        200: OpenApiResponse(
            description="Password updated successfully",
            examples=[
                OpenApiExample(
                    "Password updated successfully",
                    value={"success": 1, "message": "Password updated successfully"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Invalid input",
            examples=[
                OpenApiExample(
                    "All fields are required",
                    value={"success": 0, "message": "All fields are required"},
                ),
                OpenApiExample(
                    "New password must be at least 8 characters long",
                    value={
                        "success": 0,
                        "message": "New password must be at least 8 characters long",
                    },
                ),
            ],
        ),
        401: OpenApiResponse(
            description="User not authenticated",
            examples=[
                OpenApiExample(
                    "User not authenticated",
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
        403: OpenApiResponse(
            description="Incorrect password",
            examples=[
                OpenApiExample(
                    "Incorrect password",
                    value={"success": 0, "message": "Incorrect password"},
                ),
            ],
        ),
    },
)
@api_view(["PUT"])
def userPass(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data

            if not data.get("oldPassword") or not data.get("newPassword"):
                return Response(
                    {"success": 0, "message": "All fields are required"}, status=400
                )

            if len(data.get("newPassword")) < 8:
                return Response(
                    {
                        "success": 0,
                        "message": "New password must be at least 8 characters long",
                    },
                    status=400,
                )

            if not user.check_password(data.get("oldPassword")):
                return Response(
                    {"success": 0, "message": "Incorrect password"}, status=403
                )

            user.set_password(data.get("newPassword"))
            user.save()
            return Response(
                {"success": 1, "message": "Password updated successfully"}, status=200
            )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@extend_schema(
    methods=["DELETE"],
    operation_id="delete_user",
    tags=["profile"],
    request=DeleteUserSerializer,
    responses={
        200: OpenApiResponse(
            description="User deleted successfully",
            examples=[
                OpenApiExample(
                    "User deleted successfully",
                    value={"success": 1, "message": "User deleted successfully"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Password is required",
            examples=[
                OpenApiExample(
                    "Password is required",
                    value={"success": 0, "message": "Password is required"},
                ),
            ],
        ),
        401: OpenApiResponse(
            description="User not authenticated",
            examples=[
                OpenApiExample(
                    "User not authenticated",
                    value={"success": 0, "message": "User not authenticated"},
                ),
            ],
        ),
        403: OpenApiResponse(
            description="Incorrect password",
            examples=[
                OpenApiExample(
                    "Incorrect password",
                    value={"success": 0, "message": "Incorrect password"},
                ),
            ],
        ),
    },
)
@api_view(["DELETE"])
def userDelete(request):
    if request.method == "DELETE":
        user = request.user
        if user.is_authenticated:
            data = request.data

            if not data.get("password"):
                return Response(
                    {"success": 0, "message": "Password is required"}, status=400
                )

            if not user.check_password(data.get("password")):
                return Response(
                    {"success": 0, "message": "Incorrect password"}, status=403
                )

            user.delete()
            return Response(
                {"success": 1, "message": "User deleted successfully"}, status=200
            )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@login_required
def companyVehicles(request):
    if request.method == "GET":
        company = request.user
        if company.is_authenticated:
            try:
                dealership = Dealership.object.filter(user=company)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))

                images = []
                makeNames = []
                modelNames = []
                registrations = []
                prices = []
                ratings = []
                noOfReviews = []
                isVisible = []
                vehicleIds = []
                offerIds = []

                vehicles = Vehicle.objects.filter(dealer_id=dealership.dealer_id)
                # Return: [image, makeName, modelName, registration, price, rating, noOfReviews, isVisible, vehicle_id, offer_id]
                res = []
                for vehicle in vehicles:
                    # make, model, registration, noOfReviews, isVisible, vehicleId
                    model = Model.object.filter(vehicle_id=vehicle)
                    makeNames.append(model.makeName)
                    modelNames.append(model.modelName)
                    registrations.append(vehicle.registration)
                    noOfReviews.append(vehicle.noOfReviews)
                    isVisible.append(vehicle.isVisible)
                    vehicleIds.append(vehicle.vehicle_id)

                    # price, rating, offerId, image
                    offer = Offer.object.filter(
                        model=vehicle.model, dealer_id=dealership.dealer_id
                    )
                    prices.append(offer.price)
                    ratings.append(offer.rating)
                    offerIds.append(offer.offer_id)
                    images.append(offer.image)

                    current = {
                        "makeName": model.makeName,
                        "modelName": model.modelName,
                        "registration": vehicle.registration,
                        "noOfReviews": vehicle.noOfReviews,
                        "isVisible": vehicle.isVisible,
                        "vehicleId": vehicle.vehicle_id,
                        "price": offer.price,
                        "rating": offer.rating,
                        "offerId": offer.offer_id,
                        "image": offer.image,
                    }
                    res.append(current)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }
                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no vehicles yet!",
                    },
                    status=200,
                )


@login_required
def toogleVehicleVisibility(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not data.get("vehicleId"):
                return Response(
                    {"success": 0, "message": "Vehicle ID is required"}, status=400
                )
            try:
                vehicle = Vehicle.objects.get(vehicle_id=data.get("vehicleId"))
                vehicle.isVisible = not vehicle.isVisible
                vehicle.save()
                return Response(
                    {
                        "success": 1,
                        "message": "Vehicle visibility toggled successfully",
                    },
                    status=200,
                )
            except:
                return Response(
                    {"success": 0, "message": "Company has no vehicles yet!"},
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@login_required
def companyOffers(request):
    if request.method == "GET":
        company = request.user
        if company.is_authenticated:
            try:
                dealership = Dealership.object.filter(user=company)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))

                images = []
                makeNames = []
                modelNames = []
                prices = []
                ratings = []
                noOfReviews = []
                offerIds = []
                isVisible = []

                offers = Offer.objects.filter(dealer_id=dealership.dealer_id)
                # Return: [image, makeName, modelName, price, rating, noOfReviews, isVisible, offer_id]
                res = []
                for offer in offers:
                    # make, model, noOfReviews, offerId
                    model = Model.object.filter(model_id=offer.model)
                    vehicle = Vehicle.object.filter(
                        model=model, dealer_id=dealership.dealer_id
                    )
                    makeNames.append(model.makeName)
                    modelNames.append(model.modelName)
                    noOfReviews.append(offer.noOfReviews)
                    offerIds.append(offer.offer_id)
                    isVisible.append(vehicle.isVisible)

                    # price, rating, image
                    prices.append(offer.price)
                    ratings.append(offer.rating)
                    images.append(offer.image)

                    current = {
                        "isVisible": vehicle.isVisible,
                        "makeName": model.makeName,
                        "modelName": model.modelName,
                        "noOfReviews": offer.noOfReviews,
                        "offerId": offer.offer_id,
                        "price": offer.price,
                        "rating": offer.rating,
                        "image": offer.image,
                    }
                    res.append(current)
                    retObject = {
                        "results": res[(page - 1) * limit : page * limit],
                        "isLastPage": True if len(res) <= page * limit else False,
                    }
                    return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )


@login_required
def toggleOfferVisibility(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not data.get("offerId"):
                return Response(
                    {"success": 0, "message": "Offer ID is required"}, status=400
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                offer = Offer.objects.get(offer_id=data.get("offerId"))
                vehicles = Vehicle.objects.get(
                    model=offer.model, dealer_id=dealership.dealer_id
                )
                if all(not vehicle.isVisible for vehicle in vehicles):
                    for vehicle in vehicles:
                        vehicle.isVisible = True
                        vehicle.save()
                else:
                    for vehicle in vehicles:
                        vehicle.isVisible = False
                        vehicle.save()

                return Response(
                    {"success": 1, "message": "Offer visibility toggled successfully"},
                    status=200,
                )
            except:
                return Response(
                    {"success": 0, "message": "Company has no offers yet!"}, status=200
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@login_required
def upcomingCompanyRents(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.object.filter(user_id=user)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                rents = Rent.objects.filter(dealer_id=dealership.dealer_id)
                res = []
                for rent in rents:
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)
                    vehicle = Vehicle.object.filter(vehicle_id=rent.vehicle_id)
                    offer = Offer.objects.filter(
                        dealer=rent.dealer_id, model=vehicle.model
                    )
                    model = Model.object.filter(model_id=vehicle.model_id)
                    if rent.dateTimeRented < datetime.now():
                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": offer.price,
                            "vehicleId": offer.vehicle_id,
                            "registration": vehicle.registration,
                            "makeName": model.makeName,
                            "modelName": model.modelName,
                            "image": offer.image,
                        }
                        res.append(item)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }
                return Response(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "User has no upcoming rents yet or does not exist!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@login_required
def ongoingCompanyRents(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.object.filter(user_id=user)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                rents = Rent.objects.filter(dealer_id=dealership.dealer_id)
                res = []
                for rent in rents:
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)
                    vehicle = Vehicle.object.filter(vehicle_id=rent.vehicle_id)
                    offer = Offer.objects.filter(
                        dealer=rent.dealer_id, model=vehicle.model
                    )
                    model = Model.object.filter(model_id=vehicle.model_id)
                    if (
                        rent.dateTimeRented >= datetime.now()
                        and rent.dateTimeReturned < datetime.now()
                    ):
                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": offer.price,
                            "vehicleId": offer.vehicle_id,
                            "registration": vehicle.registration,
                            "makeName": model.makeName,
                            "modelName": model.modelName,
                            "image": offer.image,
                        }
                        res.append(item)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }
                return Response(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "User has no upcoming rents yet or does not exist!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@login_required
def completedCompanyRents(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.object.filter(user_id=user)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                rents = Rent.objects.filter(dealer_id=dealership.dealership_id)
                res = []
                for rent in rents:
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)
                    vehicle = Vehicle.object.filter(vehicle_id=rent.vehicle_id)
                    offer = Offer.objects.filter(
                        dealer=rent.dealer_id, model=vehicle.model
                    )
                    model = Model.object.filter(model_id=vehicle.model_id)
                    if rent.dateTimeReturned >= datetime.now():
                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": offer.price,
                            "vehicleId": offer.vehicle_id,
                            "registration": vehicle.registration,
                            "makeName": model.makeName,
                            "modelName": model.modelName,
                            "image": offer.image,
                        }
                        res.append(item)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }
                return Response(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "User has no upcoming rents yet or does not exist!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@login_required
def companyReviews(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.object.filter(user_id=user)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))

                rents = Rent.object.filter(dealer_id=dealership.dealer_id)
                res = []
                for rent in rents:
                    reviews = Review.object.filter(rent_id=rent.rent_id)
                    vehicle = Vehicle.object.filter(vehicle_id=rent.vehicle_id)
                    model = Model.object.filter(model_id=vehicle.model_id)
                    offer = Offer.object.filter(
                        dealer_id=dealership.dealer_id, model_id=vehicle.model_id
                    )
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)

                    current = {
                        "image": offer.image,
                        "makeName": model.makeName,
                        "modelName": model.modelName,
                        "registration": vehicle.registration,
                        "firstName": rentUser.first_name,
                        "lastName": rentUser.last_name,
                        "descriptions": [review.description for review in reviews],
                        "ratings": [review.rating for review in reviews],
                        "vehicleId": vehicle.vehicle_id,
                    }
                    res.append(current)
                    retObject = {
                        "results": res[(page - 1) * limit : page * limit],
                        "isLastPage": True if len(res) <= page * limit else False,
                    }
                    return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )


@login_required
def companyEarnings(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.object.filter(user_id=user)
                year = int(request.GET.get("year", datetime.now().year))

                # Return: {totalEarnings, yearEarnings, totalRentals, yearRentals, monthlyEarnings: [earnings..12]}
                rents = Rent.object.filter(dealer_id=dealership.dealer_id)
                res = []
                totalEarnings = 0
                monthlyEarnings = {i: 0 for i in range(1, 13)}
                thisYearEarnings = 0
                totalRentals = 0
                thisYearRentals = 0
                for rent in rents:
                    totalEarnings += rent.price
                    totalRentals += 1
                    if rent.dateTimeReturned.year == year:
                        thisYearEarnings += rent.price
                        thisYearRentals += 1
                        monthlyEarnings[rent.dateTimeReturned.month] += rent.price

                current = {
                    "totalEarnings": totalEarnings,
                    "yearEarnings": thisYearEarnings,
                    "totalRentals": totalRentals,
                    "yearRentals": thisYearRentals,
                    "monthlyEarnings": monthlyEarnings,
                }
                retObject = {"results": current, "isLastPage": True}
                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )


@login_required
def companyInfo(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data

            logo = data.get("companyLogo")
            name = data.get("companyName")
            phoneNo = data.get("phoneNo")
            description = data.get("description")
            if not user.check_password(data.get("password")):
                return Response(
                    {"success": 0, "message": "Wrong password!"}, status=401
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                if phoneNo:
                    dealership.phoneNo = phoneNo
                if name:
                    dealership.companyName = name
                if description:
                    dealership.description = description
                if logo:
                    dealership.image = logo
                dealership.save()
                return Response(
                    {"success": 1, "message": "Company info updated successfully"},
                    status=200,
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)

    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                # Return: {companyLogo, companyName, phoneNo, description}
                dealership = Dealership.object.filter(user_id=user)
                workingHours = WorkingHours.object.filter(
                    dealership_id=dealership.dealer_id
                )
                res = []
                for workingHour in workingHours:
                    current = {
                        "day": workingHour.day,
                        "startTime": workingHour.startTime,
                        "endTime": workingHour.endTime,
                    }
                    res.append(current)
                retObject = {"results": res, "isLastPage": True}
                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )


@login_required
def companyPasswordChange(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data

            if not data.get("oldPassword") or not data.get("newPassword"):
                return Response(
                    {"success": 0, "message": "All fields are required"}, status=400
                )

            if len(data.get("newPassword")) < 8:
                return Response(
                    {
                        "success": 0,
                        "message": "New password must be at least 8 characters long",
                    },
                    status=400,
                )

            if not user.check_password(data.get("oldPassword")):
                return Response(
                    {"success": 0, "message": "Incorrect password"}, status=403
                )

            user.set_password(data.get("newPassword"))
            user.save()
            return Response(
                {"success": 1, "message": "Password updated successfully"}, status=200
            )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@login_required
def companyLocations(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.object.filter(user_id=user)
                # Return: [streetName, streetNo, cityName, location_id]
                locations = Location.object.filter(dealership_id=dealership.dealer_id)
                res = [{}]
                for location in locations:
                    current = {
                        "cityName": location.cityName,
                        "streetName": location.streetName,
                        "streetNo": location.streetNo,
                        "locationId": location.location_id,
                    }
                    if location.isHQ:
                        res[0] = current
                    else:
                        res.append(current)
                retObject = {"results": res, "isLastPage": True}
                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no locations yet!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@login_required
def companySetHQ(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not data.get("locationId"):
                return Response(
                    {"success": 0, "message": "Location ID is required"}, status=200
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                locations = Location.object.filter(dealership_id=dealership.dealer_id)

                for location in locations:
                    location.isHQ = False
                    location.save()
                location = Location.object.filter(location_id=data.get("locationId"))
                location.isHQ = True
                location.save()
                return Response(
                    {"success": 1, "message": "HQ location set successfully"},
                    status=200,
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company has no locations yet or does not exist!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@login_required
def companyLocation(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            data = request.data
            locationId = request.locationId
            if not data.get("locationId"):
                return Response(
                    {"success": 0, "message": "Location ID is required"}, status=200
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                location = Location.object.filter(
                    location_id=locationId,
                    dealership_id=dealership.dealer_id,
                )
                workingHours = WorkingHours.object.filter(
                    location_id=location.location_id
                )
                retObject = {
                    "latitude": location.latitude,
                    "longitude": location.longitude,
                    "streetName": location.streetName,
                    "streetNo": location.streetNo,
                    "cityName": location.cityName,
                    "workingHours": [
                        {
                            "dayOfTheWeek": workingHour.day,
                            "startTime": workingHour.startTime,
                            "endTime": workingHour.endTime,
                        }
                        for workingHour in workingHours
                    ],
                    "isLastPage": True,
                }
                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company has no locations yet or does not exist!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    elif request.method == "DELETE":
        user = request.user
        if user.is_authenticated:
            data = request.data
            locationId = request.locationId
            if not data.get("locationId"):
                return Response(
                    {"success": 0, "message": "Location ID is required"}, status=200
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                location = Location.object.filter(
                    location_id=locationId,
                    dealership_id=dealership.dealer_id,
                )
                location.delete()
                return Response(
                    {"success": 1, "message": "Location deleted successfully"},
                    status=200,
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company has no locations yet or does not exist!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    elif request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            locationId = request.locationId
            if not request.locationId:
                return Response(
                    {"success": 0, "message": "Location ID is required"}, status=200
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                location = Location.object.filter(
                    location_id=locationId,
                    dealership_id=dealership.dealer_id,
                )
                workingHours = data.get("workingHours")
                for workingHour in workingHours:
                    wh = WorkingHourse.object.filter(
                        location_id=locationId, day=workingHour["dayOfTheWeek"]
                    )
                    wh.startTime = (
                        workingHour["startTime"]
                        if workingHour["startTime"]
                        else wh.startTime
                    )
                    wh.endTime = (
                        workingHour["endTime"] if workingHour["endTime"] else wh.endTime
                    )

                    wh.save()
                return Response(
                    {"success": 1, "message": "Location deleted successfully"},
                    status=200,
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company has no locations yet or does not exist!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    elif request.method == "POST":
        user = request.user
        if user.is_authenticated:
            data = request.data
            #  workingHours: [dayOfTheWeek, startTime, endTime]}
            workingHours = data.get("workingHours")
            if (
                not data.get("streetName")
                or not data.get("streetNo")
                or not data.get("cityName")
            ):
                return Response(
                    {"success": 0, "message": "All fields are required"}, status=400
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                location = Location.object.create(
                    latitude=data.get("latitude"),
                    longitude=data.get("longitude"),
                    streetName=data.get("streetName"),
                    countryName=data.get("countryName"),
                    streetNo=data.get("streetNo"),
                    cityName=data.get("cityName"),
                    dealership_id=dealership.dealer_id,
                    isHQ=False,
                )
                location.save()
                for workingHour in workingHours:
                    wh = WorkingHours.object.create(
                        day=workingHour["dayOfTheWeek"],
                        startTime=workingHour["startTime"],
                        endTime=workingHour["endTime"],
                        location_id=location.location_id,
                    )
                    wh.save()
                return Response(
                    {"success": 1, "message": "Location added successfully"}, status=200
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no locations yet!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@login_required
def deleteCompany(request):
    if request.method == "DELETE":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not data.get("password"):
                return Response(
                    {"success": 0, "message": "Password is required"}, status=400
                )
            try:
                if not user.check_password(data.get("password")):
                    return Response(
                        {"success": 0, "message": "Incorrect password"}, status=403
                    )
                user.delete()
                return Response(
                    {"success": 1, "message": "Company deleted successfully"},
                    status=200,
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no locations yet!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@login_required
def companyVehicleEdit(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not request.GET.get("vehicleId"):
                return Response(
                    {"success": 0, "message": "Vehicle ID is required"}, status=400
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                vehicle = Vehicle.objects.get(
                    vehicle_id=request.GET.get("vehicleId"),
                    dealer_id=dealership.dealer_id,
                )
                hasUpcomingRental = False
                upcoming_rental = Rent.objects.filter(
                    vehicle_id=vehicle.vehicle_id,
                )
                for rental in upcoming_rental:
                    if rental.dateTimeRented >= datetime.now():
                        hasUpcomingRental = True
                        break
                if hasUpcomingRental:
                    return Response(
                        {
                            "success": 0,
                            "message": "Vehicle has upcoming rentals, cannot change location!",
                        },
                        status=200,
                    )
                if data.get("registration"):
                    vehicle.registration = data.get("registration")
                if data.get("locationId"):
                    vehicle.location_id = data.get("locationId")
                vehicle.save()
                return Response(
                    {"success": 1, "message": "Vehicle updated successfully"},
                    status=200,
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no vehicles yet!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.object.filter(user_id=user)
                # Return: {registration, streetName, streetNo, cityName, location_id}
                vehicle = Vehicle.objects.filter(
                    dealer_id=dealership.dealer_id,
                    vehicle_id=request.GET.get("vehicleId"),
                )
                location = location.object.filter(location_id=vehicle.location_id)
                retObject = {
                    "registration": vehicle.registration,
                    "streetName": location.streetName,
                    "streetNo": location.streetNo,
                    "cityName": location.cityName,
                    "locationId": location.location_id,
                }
                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no vehicles yet!",
                    },
                    status=200,
                )

@login_required
def companyVehicle(request):
    if request.method == "DELETE":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not request.GET.get("vehicleId"):
                return Response(
                    {"success": 0, "message": "Vehicle ID is required"}, status=400
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                vehicle = Vehicle.objects.get(
                    vehicle_id=request.GET.get("vehicleId"),
                    dealer_id=dealership.dealer_id,
                )
                vehicles = Vehicle.object.get(
                    dealer_id=dealership.dealer_id, model_id=vehicle.model_id
                )
                hasUpcomingRental = False
                upcoming_rental = Rent.objects.filter(
                    vehicle_id=vehicle.vehicle_id,
                )
                for rental in upcoming_rental:
                    if rental.dateTimeRented >= datetime.now():
                        hasUpcomingRental = True
                        break
                if hasUpcomingRental:
                    return Response(
                        {
                            "success": 0,
                            "message": "Vehicle has upcoming rentals, cannot delete!",
                        },
                        status=200,
                    )
                if len(vehicles) == 1:
                    offer = Offer.objects.filter(
                        model=vehicle.model_id, dealer_id=dealership.dealer_id
                    )
                    offer.delete()
                vehicle.delete()
                return Response(
                    {"success": 1, "message": "Vehicle deleted successfully"},
                    status=200,
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no vehicles yet!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    if request.method == "POST":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if (
                not data.get("registration")
                or not data.get("model_id")
                or not data.get("location_id")
            ):
                return Response(
                    {"success": 0, "message": "All fields are required"}, status=400
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                model = Model.object.filter(model_id=data.get("model_id"))
                location = Location.object.filter(
                    location_id=data.get("locationId"),
                    dealership_id=dealership.dealer_id,
                )
                vehicle = Vehicle.object.create(
                    model_id=model.model_id,
                    location_id=location.location_id,
                    dealer_id=dealership.dealer_id,
                    registration=data.get("registration"),
                    noOfReviews=0,
                    isVisible=True,
                    timesRented=0,
                    rating=0,
                )
                vehicle.save()
                return Response(
                    {"success": 1, "message": "Vehicle added successfully"}, status=200
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or wronge vehicle id!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

@login_required
def companyOffer(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not data.get("offerId"):
                return Response(
                    {"success": 0, "message": "Offer ID is required"}, status=400
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                offer = Offer.objects.get(
                    offer_id=request.GET.get("offerId"),
                )
                if data.get("price"):
                    offer.price = data.get("price")
                if data.get("image"):
                    offer.image = data.get("image")
                if data.get("description"):
                    offer.description = data.get("description")
                offer.save()
                return Response(
                    {"success": 1, "message": "Offer updated successfully"}, status=200
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    if request.method == "POST":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if (
                not data.get("price")
                or not data.get("image")
                or not data.get("description")
                or not data.get("model_id")
            ):
                return Response(
                    {"success": 0, "message": "All fields are required"}, status=400
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                model = Model.object.filter(model_id=data.get("model_id"))
                offer = Offer.object.create(
                    model_id=model.model_id,
                    dealer_id=dealership.dealer_id,
                    price=data.get("price"),
                    image=data.get("image"),
                    description=data.get("description"),
                    noOfReviews=0,
                    rating=0,
                )
                offer.save()
                return Response(
                    {"success": 1, "message": "Offer added successfully"}, status=200
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or wronge vehicle id!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    if request.method == "DELETE":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not data.get("offerId"):
                return Response(
                    {"success": 0, "message": "Offer ID is required"}, status=400
                )
            try:
                dealership = Dealership.object.filter(user_id=user)
                offer = Offer.objects.get(
                    offer_id=request.GET.get("offerId"),
                )
                offer.delete()
                return Response(
                    {"success": 1, "message": "Offer deleted successfully"}, status=200
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.object.filter(user_id=user)
                # , makeName, modelName,
                offer = Offer.objects.filter(
                    # dealer_id=dealership.dealer_id,
                    offer_id=request.GET.get("offerId"),
                )
                model = Model.object.filter(model_id=offer.model_id)
                retObject = {
                    "price": offer.price,
                    "image": offer.image,
                    "description": offer.description,
                    "model_id": model.model_id,
                    "makeName": model.makeName,
                    "modelName": model.modelName,
                }
                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )

@login_required
def companyVehicleLog(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated():
            try:
                vehicle_id = request.GET.get("vehicleId")
                dealership = Dealership.object.filter(user_id=user)
                vehicle = Vehicle.object.filter(vehicle_id=vehicle_id)
                model = Model.object.filter(model_id=vehicle.model_id)
                location = Location.object.filter(location_id=vehicle.location_id)
                rents = Rent.object.filter(vehicle_id=vehicle_id)
                rentCount = 0
                rentTime = 0
                moneyMade = 0
                onGoing = {}
                for rent in rents:
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)
                    rentLocation = Location.object.filter(
                        location_id=rent.rentedLocation_id
                    )
                    returnLocation = Location.object.filter(
                        location_id=rent.returnLocation_id
                    )
                    if rent.dateTimeReturned >= datetime.now():
                        onGoing = {
                            "pickUpDateTime": rent.dateTimeRented,
                            "dropOffDateTime": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": rent.price,
                            "pickUpLocationId": rent.rentedLocation_id,
                            "dropOffLocationId": rent.returnLocation_id,
                            "pickUpLocation": rentLocation.streetName
                            + " "
                            + rentLocation.streetNo,
                            "dropOffLocation": returnLocation.streetName
                            + " "
                            + returnLocation.streetNo,
                        }
                    rentTime += (
                        rent.dateTimeReturned - rent.dateTimeRented
                    ).total_seconds()
                    rentCount += 1
                    moneyMade += rent.price

                retObject = {
                    "makeName": model.makeName,
                    "modelName": model.modelName,
                    "registration": vehicle.registration,
                    "streetName": location.streetName,
                    "streetNo": location.streetNo,
                    "cityName": location.cityName,
                    "timesRented": rentCount,
                    "moneyMade": moneyMade,
                    "rentedTime": rentTime,
                    "onGoing": onGoing,
                }

                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no vehicles yet!",
                    },
                    status=200,
                )

@login_required
def companyLogUpcoming(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated():
            try:
                dealership = Dealership.object.filter(user_id=user)
                rents = Rent.object.filter(dealer_id=dealership.dealer_id,vehicle_id=request.GET.get("vehicleId"))
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                vehicle_id = request.GET.get("vehicleId")
                res = []
                for rent in rents:
                    if (
                        rent.vehicle_id != vehicle_id
                        or rent.dateTimeRented < datetime.now()
                    ):
                        continue
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)
                    if rent.dateTimeRented >= datetime.now():
                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": rent.price,
                            "pickUpLocation": rent.rentedLocation_id,
                            "dropOffLocation": rent.returnLocation_id,
                        }
                        res.append(item)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }

                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )

@login_required
def companyLogOngoing(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated():
            try:
                dealership = Dealership.object.filter(user_id=user)
                rents = Rent.object.filter(dealer_id=dealership.dealer_id),vehicle_id=request.GET.get("vehicleId")
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                vehicle_id = request.GET.get("vehicleId")
                res = []
                for rent in rents:
                    if (
                        rent.vehicle_id != vehicle_id
                        or rent.dateTimeRented > datetime.now()
                        or (
                            rent.dateTimeReturned < datetime.now()
                            and rent.DateTimeRented >= datetime.now()
                        )
                    ):
                        continue
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)
                    if rent.dateTimeRented >= datetime.now():
                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": rent.price,
                            "pickUpLocation": rent.rentedLocation_id,
                            "dropOffLocation": rent.returnLocation_id,
                        }
                        res.append(item)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }

                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )

@login_required
def companyLogCompleted(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated():
            try:
                dealership = Dealership.object.filter(user_id=user)
                rents = Rent.object.filter(
                    dealer_id=dealership.dealer_id,
                    vehicle_id=request.GET.get("vehicleId"),
                )
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                vehicle_id = request.GET.get("vehicleId")
                res = []
                for rent in rents:
                    if (
                        rent.vehicle_id != vehicle_id
                        or rent.dateTimeReturned > datetime.now()
                        or rent.dateTimeRented > datetime.now()
                    ):
                        continue
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)
                    if rent.dateTimeRented >= datetime.now():
                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": rent.price,
                            "pickUpLocation": rent.rentedLocation_id,
                            "dropOffLocation": rent.returnLocation_id,
                        }
                        res.append(item)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }

                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )

@login_required
def companyLogReviews(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated():
            try:
                # Return: date, rating, description]
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                dealership = Dealership.object.filter(user_id=user)
                vehicle_id = request.GET.get("vehicleId")
                rents = Rent.object.filter(
                    dealer_id=dealership.dealer_id,
                    vehicle_id=vehicle_id)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                res = []
                for rent in rents:
                    if rent.vehicle_id != vehicle_id:
                        continue
                    review = Review.object.filter(rent_id=rent.rent_id)
                    rentoid = Rentoid.object.filter(rentoid_id=rent.rentoid_id)
                    rentUser = User.object.filter(id=rentoid.user_id)

                    item = {
                        "firstName": rentUser.first_name,
                        "lastName": rentUser.last_name,
                        "date" : review.reviewDate,
                        "description": review.description,
                        "rating": review.rating
                    }
                    res.append(item)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }

                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )
