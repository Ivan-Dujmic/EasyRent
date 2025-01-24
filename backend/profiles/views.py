from datetime import timedelta, datetime
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.decorators import *
from django import forms
from datetime import datetime
from django.utils.timezone import make_aware, make_naive
import random
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Avg, Count, Sum, F, Q
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
    OpenApiParameter,
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
            # Get the rentoid for the user
            rentoid = Rentoid.objects.select_related('user').get(user=user)

            # Fetch the latest 10 rentals sorted by dateTimeReturned
            rentals = (
                Rent.objects.filter(rentoid=rentoid.rentoid_id)
                .select_related(
                    'vehicle__model',  # Vehicle model data
                    'vehicle__location__dealership__user',  # Dealer user data
                )
                .prefetch_related(
                    'vehicle__location__dealership__offer_set',  # Offers for the dealer
                )
                .order_by('-dateTimeReturned')[:20]  # Limit to latest 10 by dateTimeReturned
            )

            rentalData = []
            for rental in rentals:
                vehicle = rental.vehicle
                pickupLocation = Location.objects.get(location_id=rental.rentedLocation)
                dropoffLocation = Location.objects.get(location_id=rental.returnLocation)
                dealer = None
                try:
                    dealer = rental.dealer
                except:
                    pass

                # Get the first matching offer
                offer = next(
                    (
                        o for o in dealer.offer_set.all()
                        if o.model_id == vehicle.model_id
                    ),
                    None,
                )

                if offer:
                    model = offer.model
                    item = {
                        "makeName": model.makeName,
                        "modelName": model.modelName,
                        "companyName": dealer.user.first_name if dealer else '',
                        "noOfSeats": model.noOfSeats,
                        "automatic": model.automatic,
                        "price": offer.price,
                        "rating": offer.rating,
                        "noOfReviews": offer.noOfReviews,
                        "dateTimeRented": rental.dateTimeRented,
                        "dateTimeReturned": rental.dateTimeReturned,
                        "pickupLocation": pickupLocation.streetName + " " + pickupLocation.streetNo + ", " + pickupLocation.cityName,
                        "dropoffLocation": dropoffLocation.streetName + " " + dropoffLocation.streetNo + ", " + dropoffLocation.cityName,
                        "expired": isUserRentalExpired(rental),
                        "canReview": canUserReview(rental),
                        "offer_id": offer.offer_id,
                        "rent_id": rental.rent_id,
                        "image": request.build_absolute_uri(offer.image.url) if offer.image else None,
                    }

                    rentalData.append(item)

            return Response(rentalData, status=200)
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


def isUserRentalExpired(rental):
    return rental.dateTimeReturned < now()


def canUserReview(rental):
    oneMonthAfterExpiry = rental.dateTimeReturned + timedelta(days=30)
    hasReviewed = Review.objects.filter(rent=rental).exists()
    return (
        rental.dateTimeReturned < now()
        and not hasReviewed
        and now() <= oneMonthAfterExpiry
    )


def calculateReviewsForOffer(offer):
    vehicles = Vehicle.objects.filter(dealer=offer.dealer, model=offer.model)
    total_rating = 0
    total_reviews = 0
    for vehicle in vehicles:
        if (vehicle.rating != None):
            total_rating += vehicle.rating * vehicle.noOfReviews
            total_reviews += vehicle.noOfReviews
    offer.rating = round(total_rating / total_reviews, 2) if total_reviews > 0 else 0
    offer.noOfReviews = total_reviews
    offer.save()


def calculateReviewsForVehicle(vehicle):
    rentals = Rent.objects.filter(vehicle=vehicle).values("rent_id")
    reviews = Review.objects.filter(rent__in=rentals).all()
    rating = 0
    for review in reviews:
        rating += review.rating
    review_count = reviews.count()
    vehicle.rating = round(rating / review_count, 2) if review_count > 0 else 0
    vehicle.noOfReviews = review_count
    vehicle.save()


def calculateReviewsForAllOffers():
  # Retrieve all offers
    offers = Offer.objects.all()

    for offer in offers:
        # Filter vehicles matching the offer's dealer and model
        matching_vehicles = Vehicle.objects.filter(
            Q(dealer=offer.dealer) & Q(model=offer.model) & Q(isVisible=True)
        ).annotate(
            weighted_sum=F('rating') * F('noOfReviews'),  # Weighted sum of ratings
        )

        # Aggregate weighted ratings and total reviews
        stats = matching_vehicles.aggregate(
            total_weighted_sum=Sum('weighted_sum'),
            total_reviews=Sum('noOfReviews'),
        )

        total_reviews = stats['total_reviews'] or 0  # Handle None as 0

        # Calculate weighted average rating
        if total_reviews > 0:
            weighted_avg_rating = round((stats['total_weighted_sum'] or 0) / total_reviews, 2)
        else:
            weighted_avg_rating = 0  # No reviews, so the rating is 0

        # Update the offer with the calculated values
        offer.rating = weighted_avg_rating
        offer.noOfReviews = total_reviews
        offer.save()


def calculateReviewsForAllVehicles():
    vehicles_qs = (
        Vehicle.objects
        .annotate(
            avg_rating=Avg('rent__review__rating'),
            rev_count=Count('rent__review')
        )
    )
    # Update in bulk
    for v in vehicles_qs:
        v.rating = round(v.avg_rating or 0, 2)
        v.noOfReviews = v.rev_count
    Vehicle.objects.bulk_update(vehicles_qs, ['rating', 'noOfReviews'])


@extend_schema(
    methods=["GET"],
    operation_id="calculate_all_reviews",
    tags=["admin"],
)
@api_view(["GET"])
def calculateAllReviews(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            if user.is_superuser:
                try:
                    calculateReviewsForAllVehicles()
                    calculateReviewsForAllOffers()
                except Exception as e:
                    return Response({"error": str(e)}, status=500)
                    
                return Response({"message": "Reviews calculated"}, status=200)
            else:
                return Response({"error": "User is not a superuser"}, status=403)

@extend_schema(
    methods=["POST"],
    operation_id="post_review",
    tags=["profile"],
    request=PostReviewSerializer,
)
@api_view(["POST"])
def postReview(request, rent_id):
    try:
        rent = Rent.objects.get(pk=rent_id)
        user = request.user
        if not user.is_authenticated or not canUserReview(rent):
            return Response({"error": "User can't review"}, status=404)
        rentoid = Rentoid.objects.get(user=user)
        if Review.objects.filter(rent=rent).exists():
            return Response({"error": "Review already exists"}, status=404)
        rating = request.data.get("rating")
        description = request.data.get("description")
        if rating == None:
            return Response({"error": "Rating not specified"}, status=404)
        try:
            rating = int(rating)
        except:
            return Response({"error": "Invalid rating format"}, status=404)
        if rating < 1 or rating > 5:
            return Response({"error": "Invalid rating format"}, status=404)
        try:
            Review.objects.create(
                rent=rent, rating=rating, description=description, reviewDate=datetime.now()
            )
        except Exception as e:
            print(e)
            return Response({"error": "Review already exists"}, status=400)
        vehicle = Vehicle.objects.get(pk=rent.vehicle.vehicle_id)
        calculateReviewsForVehicle(vehicle)
        offer = Offer.objects.get(model=rent.vehicle.model, dealer=rent.vehicle.dealer)
        calculateReviewsForOffer(offer)
        return Response({"message": "Review added"}, status=200)
    except Rent.DoesNotExist:
        return Response({"error": "Rent not found"}, status=404)


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
    methods=["POST"],
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
@login_required
@api_view(["POST"])
def userDelete(request):
    if request.method == "POST":
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


@extend_schema(
    methods=["GET"],
    operation_id="get_company_vehicles",
    tags=["profile"],
    responses={
        200: GetCompanyVehicles(many=True),
    },
    parameters=[
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page as integer",
            required=False,
            default=1,
        ),
        OpenApiParameter(
            name="limit",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Limit as integer",
            required=False,
            default=10,
        ),
    ]
)
@login_required
@api_view(["GET"])
def companyVehicles(request):
    if request.method == "GET":
        company = request.user
        if company.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=company)
                page = int(request.GET.get("page", 1))  # Default to page 1
                limit = int(request.GET.get("limit", 10))  # Default to limit 10

                # Get vehicles for the dealership
                vehicles_query = Vehicle.objects.filter(dealer=dealership).order_by('registration')
                
                # Apply pagination at the query level
                paginator = Paginator(vehicles_query, limit)
                try:
                    vehicles = paginator.page(page)
                except EmptyPage:
                    return JsonResponse(
                        {
                            "results": [],
                            "isLastPage": True,
                        },
                        status=200,
                    )

                res = []
                for vehicle in vehicles:
                    # Fetch related model and offer information
                    model = Model.objects.get(model_id=vehicle.model_id)
                    offer = Offer.objects.filter(model=vehicle.model, dealer=dealership).first()

                    if offer:
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
                            "image": request.build_absolute_uri(offer.image.url)
                                if offer.image
                                else None
                        }
                    else:
                        current = {
                            "makeName": model.makeName,
                            "modelName": model.modelName,
                            "registration": vehicle.registration,
                            "noOfReviews": vehicle.noOfReviews,
                            "isVisible": vehicle.isVisible,
                            "vehicleId": vehicle.vehicle_id,
                            "price": None,
                            "rating": None,
                            "offerId": None,
                            "image": None,
                        }
                    res.append(current)

                retObject = {
                    "results": res,
                    "isLastPage": not vehicles.has_next(),  # Check if it's the last page
                }
                return JsonResponse(retObject, status=200)
            except Dealership.DoesNotExist:
                return JsonResponse(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no vehicles yet!",
                    },
                    status=200,
                )
            except Exception as e:
                print(e)
                return JsonResponse(
                    {
                        "success": 0,
                        "message": f"An error occurred: {str(e)}",
                    },
                    status=500,
                )
            

@login_required
@api_view(["PUT"])
def toogleVehicleVisibility(request, vehicle_id):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not vehicle_id:
                return Response(
                    {"success": 0, "message": "Vehicle ID is required"}, status=400
                )
            try:
                vehicle = Vehicle.objects.get(vehicle_id=vehicle_id)
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
                    {"success": 0, "message": "This vehicle does not exist"},
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@extend_schema(
    methods=["GET"],
    operation_id="get_company_offers",
    tags=["profile"],
    responses={
        200: GetCompanyOffers(many=True),
    },
    parameters=[
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page as integer",
            required=False,
            default=1,
        ),
        OpenApiParameter(
            name="limit",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Limit as integer",
            required=False,
            default=10,
        ),
    ],
)
@login_required
@api_view(["GET"])
def companyOffers(request):
    if request.method == "GET":
        company = request.user
        if company.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=company)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))

                offers = Offer.objects.filter(dealer=dealership)
                # Return: [image, makeName, modelName, price, rating, noOfReviews, isVisible, offer_id]
                res = []
                for offer in offers:
                    # make, model, noOfReviews, offerId
                    model = Model.objects.get(model_id=offer.model_id)
                    vehicles = Vehicle.objects.filter(model=model, dealer=dealership)
                    current = {
                        "isVisible": any(vehicle.isVisible for vehicle in vehicles),
                        "makeName": model.makeName,
                        "modelName": model.modelName,
                        "noOfReviews": offer.noOfReviews,
                        "offerId": offer.offer_id,
                        "price": offer.price,
                        "rating": offer.rating,
                        "image": request.build_absolute_uri(offer.image.url)
                    }

                    res.append(current)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }
                return JsonResponse(retObject, status=200)
            except Exception as e:
                print(e)
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=200,
                )


@login_required
@api_view(["PUT"])
def toggleOfferVisibility(request, offer_id):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not offer_id:
                return Response(
                    {"success": 0, "message": "Offer ID is required"}, status=400
                )
            try:
                dealership = Dealership.objects.get(user=user.id)
                offer = Offer.objects.get(offer_id=offer_id)
                vehicles = Vehicle.objects.filter(model=offer.model, dealer=dealership)
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
            except Exception as e:
                print(e)
                return Response(
                    {"success": 0, "message": "This offer does not exist!"}, status=200
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@extend_schema(
    methods=["GET"],
    operation_id="get_company_rentss",
    tags=["profile"],
    responses={
        200: GetCompanyRents(many=True),
    },
    parameters=[
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page as integer",
            required=False,
            default=1,
        ),
        OpenApiParameter(
            name="limit",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Limit as integer",
            required=False,
            default=1,
        ),
    ],
)
@login_required
@api_view(["GET"])
def upcomingCompanyRents(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                rents = Rent.objects.filter(dealer=dealership)
                res = []
                for rent in rents:
                    rentoid = Rentoid.objects.get(rentoid_id=rent.rentoid_id)
                    rentUser = User.objects.get(id=rentoid.user_id)
                    vehicle = Vehicle.objects.get(vehicle_id=rent.vehicle_id)
                    offer = Offer.objects.get(dealer=rent.dealer, model=vehicle.model)
                    model = Model.objects.get(model_id=vehicle.model_id)
                    if rent.dateTimeRented > make_aware(datetime.now()):
                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": offer.price,
                            "vehicleId": vehicle.vehicle_id,
                            "registration": vehicle.registration,
                            "makeName": model.makeName,
                            "modelName": model.modelName,
                            "image": (
                                request.build_absolute_uri(offer.image.url)
                                if offer.image
                                else None
                            ),
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
                    status=404,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@extend_schema(
    methods=["GET"],
    operation_id="get_company_rents",
    tags=["profile"],
    responses={
        200: GetCompanyRents(many=True),
    },
    parameters=[
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page as integer",
            required=False,
            default=1,
        ),
        OpenApiParameter(
            name="limit",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Limit as integer",
            required=False,
            default=1,
        ),
    ],
)
@login_required
@api_view(["GET"])
def ongoingCompanyRents(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                rents = Rent.objects.filter(dealer=dealership)
                res = []
                for rent in rents:
                    rentoid = Rentoid.objects.get(rentoid_id=rent.rentoid_id)
                    rentUser = User.objects.get(id=rentoid.user_id)
                    vehicle = Vehicle.objects.get(vehicle_id=rent.vehicle_id)
                    offer = Offer.objects.get(dealer=rent.dealer, model=vehicle.model)
                    model = Model.objects.get(model_id=vehicle.model_id)
                    if rent.dateTimeReturned > make_aware(
                        datetime.now()
                    ) and rent.dateTimeRented <= make_aware(datetime.now()):

                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": offer.price,
                            "vehicleId": vehicle.vehicle_id,
                            "registration": vehicle.registration,
                            "makeName": model.makeName,
                            "modelName": model.modelName,
                            "image": (
                                request.build_absolute_uri(offer.image.url)
                                if offer.image
                                else None
                            ),
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
                    status=404,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@extend_schema(
    methods=["GET"],
    operation_id="get_company_rents",
    tags=["profile"],
    responses={
        200: GetCompanyRents(many=True),
    },
    parameters=[
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page as integer",
            required=False,
            default=1,
        ),
        OpenApiParameter(
            name="limit",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Limit as integer",
            required=False,
            default=1,
        ),
    ],
)
@login_required
@api_view(["GET"])
def completedCompanyRents(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                rents = Rent.objects.filter(dealer=dealership)
                res = []
                for rent in rents:
                    rentoid = Rentoid.objects.get(rentoid_id=rent.rentoid_id)
                    rentUser = User.objects.get(id=rentoid.user_id)
                    vehicle = Vehicle.objects.get(vehicle_id=rent.vehicle_id)
                    offer = Offer.objects.get(dealer=rent.dealer, model=vehicle.model)
                    model = Model.objects.get(model_id=vehicle.model_id)
                    if rent.dateTimeReturned <= make_aware(datetime.now()):
                        item = {
                            "dateTimePickup": rent.dateTimeRented,
                            "dateTimeReturned": rent.dateTimeReturned,
                            "firstName": rentUser.first_name,
                            "lastName": rentUser.last_name,
                            "price": offer.price,
                            "vehicleId": vehicle.vehicle_id,
                            "registration": vehicle.registration,
                            "makeName": model.makeName,
                            "modelName": model.modelName,
                            "image": (
                                request.build_absolute_uri(offer.image.url)
                                if offer.image
                                else None
                            ),
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
                    status=404,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@extend_schema(
    methods=["GET"],
    operation_id="get_company_reviews",
    tags=["profile"],
    responses={
        200: GetCompanyReviews(many=True),
    },
    parameters=[
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page as integer",
            required=False,
            default=1,
        ),
        OpenApiParameter(
            name="limit",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Limit as integer",
            required=False,
            default=1,
        ),
    ],
)
@login_required
@api_view(["GET"])
def companyReviews(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                rents = Rent.objects.filter(dealer=dealership)
                res = []
                for rent in rents:
                    try:
                        review = Review.objects.get(rent=rent)
                    except:
                        continue
                    vehicle = Vehicle.objects.get(vehicle_id=rent.vehicle_id)
                    model = Model.objects.get(model_id=vehicle.model_id)
                    offer = Offer.objects.get(
                        dealer=dealership, model_id=vehicle.model_id
                        )
                    first_name = ''
                    last_name = ''
                    try:
                        rentoid = Rentoid.objects.get(rentoid_id=rent.rentoid.rentoid_id)
                        rentUser = User.objects.get(id=rentoid.user.id)
                        first_name = rentUser.first_name
                        last_name = rentUser.last_name
                    except:
                        pass
                    current = {
                        "image": (
                            request.build_absolute_uri(offer.image.url)
                            if offer.image
                            else None
                        ),
                        "makeName": model.makeName,
                        "modelName": model.modelName,
                        "registration": vehicle.registration,
                        "firstName": first_name,
                        "lastName": last_name,
                        "descriptions": review.description,
                        "ratings": review.rating,
                        "vehicleId": vehicle.vehicle_id,
                    }
                    res.append(current)
                retObject = {
                    "results": res[(page - 1) * limit : page * limit],
                    "isLastPage": True if len(res) <= page * limit else False,
                }
                return JsonResponse(retObject, status=200)
            except Exception as e:
                print(e)
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=404,
                )


@extend_schema(
    tags=["profile"],
    responses={200: GetCompanyEarnings},
    parameters=[
        OpenApiParameter(
            name="year",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Year as integer",
            required=False,
            default=1,
        ),
    ],
)
@login_required
@api_view(["GET"])
def companyEarnings(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                year = int(request.GET.get("year"))
                rents = Rent.objects.all()
                totalEarnings = 0
                monthlyEarnings = {i: 0 for i in range(1, 13)}
                thisYearEarnings = 0
                totalRentals = 0
                thisYearRentals = 0

                for rent in rents:
                    if rent.dealer_id != dealership.dealership_id:
                        continue
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
                        "message": "Company does not exist or has no rents yet!",
                    },
                    status=404,
                )


@extend_schema(
    methods=["PUT"],
    operation_id="put_company_info",
    tags=["profile"],
    request=PutCompanyInfo,
)
@login_required
@api_view(["PUT", "GET"])
def companyInfo(request):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            company = User.objects.get(id=user.id)
            logo = request.FILES.get("logo")
            name = data.get("name")
            phoneNo = data.get("phoneNo")
            description = data.get("description")
            if not user.check_password(data.get("password")):
                return Response(
                    {"success": 0, "message": "Wrong password!"}, status=401
                )
            try:
                dealership = Dealership.objects.get(user=user.id)
                if phoneNo:
                    dealership.phoneNo = phoneNo
                if name:
                    company.first_name = name
                if description:
                    dealership.description = description
                if logo:
                    dealership.image = logo
                dealership.save()
                company.save()
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

    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                # Return: {companyLogo, companyName, phoneNo, description}
                dealership = Dealership.objects.get(user=user.id)
                retObject = {
                    "image": (
                        request.build_absolute_uri(dealership.image.url)
                        if dealership.image
                        else None
                    ),
                    "companyName": user.first_name,
                    "phoneNo": dealership.phoneNo,
                    "description": dealership.description,
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


@extend_schema(
    methods=["PUT"],
    operation_id="put_company_password",
    tags=["profile"],
    request=PutCompanyPassword,
)
@login_required
@api_view(["PUT"])
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


@extend_schema(
    methods=["GET"],
    operation_id="get_company_locations",
    tags=["profile"],
    responses={
        200: GetCompanyLocations(many=True),
    },
)
@login_required
@api_view(["GET"])
def companyLocations(request):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                # Return: [streetName, streetNo, cityName, location_id]
                locations = Location.objects.filter(
                    dealership_id=dealership.dealership_id
                )
                res = [{}]
                hq_location = None
                for location in locations:
                    current = {
                        "cityName": location.cityName,
                        "streetName": location.streetName,
                        "streetNo": location.streetNo,
                        "countryName": location.countryName,
                        "locationId": location.location_id,
                    }
                    if location.isHQ:
                        hq_location = current
                    else:
                        res.append(current)
                if hq_location:
                    res.insert(0, hq_location)
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
@api_view(["PUT"])
def companySetHQ(request, location_id):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not location_id:
                return Response(
                    {"success": 0, "message": "Location ID is required"}, status=200
                )
            try:
                dealership = Dealership.objects.get(user=user.id)
                locations = Location.objects.filter(dealership_id=dealership.dealership_id)

                for location in locations:
                    location.isHQ = False
                    location.save()
                location = Location.objects.get(dealership_id=dealership.dealership_id, location_id=location_id)
                location.isHQ = True
                location.save()
                return Response(
                    {"success": 1, "message": "HQ location set successfully"},
                    status=200,
                )
            except Exception as e:
                print(e)
                return Response(
                    {
                        "success": 0,
                        "message": "Location does not exist!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@extend_schema(
    methods=["GET"],
    operation_id="get_company_location",
    tags=["profile"],
    responses={
        200: GetCompanyLocation(),
    },
)
@extend_schema(
    methods=["PUT"],
    operation_id="put_company_location",
    tags=["profile"],
    request=PutCompanyLocation,
)
@login_required
@api_view(["GET", "PUT", "DELETE"])
def companyLocation(request, location_id):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                location = Location.objects.get(
                    location_id=location_id,
                    dealership=dealership.dealership_id,
                )
                workingHours = WorkingHours.objects.filter(location=location_id)
                retObject = {
                    "latitude": location.latitude,
                    "longitude": location.longitude,
                    "streetName": location.streetName,
                    "streetNo": location.streetNo,
                    "cityName": location.cityName,
                    "workingHours": [
                        {
                            "dayOfTheWeek": workingHour.dayOfTheWeek,
                            "startTime": workingHour.startTime,
                            "endTime": workingHour.endTime,
                        }
                        for workingHour in workingHours
                    ],
                }
                return JsonResponse(retObject, status=200)
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company has no locations yet or does not exist!",
                    },
                    status=404,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    elif request.method == "DELETE":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                location = Location.objects.get(
                    location_id=location_id,
                    dealership_id=dealership.dealership_id,
                )
                if location.isHQ:
                    return Response(
                        {
                            "success": 0,
                            "message": "Cannot delete HQ location!",
                        },
                        status=400,
                    )
                upcoming_rentals = Rent.objects.filter(
                    vehicle__location=location,
                    dateTimeRented__gte=make_aware(datetime.now())
                )
                if upcoming_rentals.exists():
                    return Response(
                        {
                            "success": 0,
                            "message": "Cannot delete location with upcoming rentals!",
                        },
                        status=400,
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
                        "message": "Location does not exist!",
                    },
                    status=400,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    elif request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            try:
                dealership = Dealership.objects.get(user=user.id)
                location = Location.objects.get(
                    location_id=location_id,
                    dealership_id=dealership.dealership_id,
                )
                workingHours = data.get("workingHours")
                for workingHour in workingHours:
                    wh = WorkingHours.objects.get(
                        location=location_id, dayOfTheWeek=workingHour["dayOfTheWeek"]
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
                    {"success": 1, "message": "Location updated successfully"},
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


@extend_schema(
    methods=["POST"],
    operation_id="post_company_location",
    tags=["profile"],
    request=PostCompanyLocation,
)
@login_required
@api_view(["POST"])
def postCompanyLocation(request):
    if request.method == "POST":
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
                dealership = Dealership.objects.get(user=user.id)
                location = Location.objects.create(
                    latitude=data.get("latitude"),
                    longitude=data.get("longitude"),
                    streetName=data.get("streetName"),
                    countryName=data.get("countryName"),
                    streetNo=data.get("streetNo"),
                    cityName=data.get("cityName"),
                    dealership=dealership,
                    isHQ=False,
                )
                for workingHour in workingHours:
                    wh = WorkingHours.objects.create(
                        dayOfTheWeek=workingHour["dayOfTheWeek"],
                        startTime=workingHour["startTime"],
                        endTime=workingHour["endTime"],
                        location=location,
                    )

                return Response(
                    {"success": 1, "message": "Location added successfully"}, status=200
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist!",
                    },
                    status=404,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )
    else:
        return Response({"success": 0, "message": "Method not allowed"}, status=405)


@extend_schema(
    methods=["POST"],
    operation_id="delete_company",
    tags=["profile"],
    request=DeleteCompanySerializer,
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
@login_required
@api_view(["POST"])
def deleteCompany(request):
    if request.method == "POST":
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


@extend_schema(
    methods=["GET"],
    operation_id="get_company_vehicle_id",
    tags=["profile"],
    responses={
        200: GetCompanyVehicleEdit(),
    },
)
@extend_schema(
    methods=["PUT"],
    operation_id="put_company_vehicle_id",
    tags=["profile"],
    request=CompanyEditVehicleSerializer
)
@extend_schema(
    methods=["DELETE"],
    operation_id="delete_company_vehicle_id",
    tags=["profile"],
)
@login_required
@api_view(["PUT", "GET", "DELETE"])
def companyVehicleEdit(request, vehicle_id):
    if request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not vehicle_id:
                return Response(
                    {"success": 0, "message": "Vehicle ID is required"}, status=400
                )
            try:
                dealership = Dealership.objects.get(user=user.id)
                vehicle = Vehicle.objects.get(
                    vehicle_id=vehicle_id,
                    dealer=dealership,
                )
                hasUpcomingRental = False
                upcoming_rental = Rent.objects.filter(
                    vehicle_id=vehicle.vehicle_id,
                )
                for rental in upcoming_rental:
                    if rental.dateTimeRented >= datetime.now():
                        hasUpcomingRental = True
                        break
                if data.get("registration"):
                    vehicle.registration = data.get("registration")
                if data.get("location_id"):
                    if hasUpcomingRental and vehicle.location_id != data.get("location_id"):
                        return Response(
                            {
                                "success": 0,
                                "message": "Vehicle has upcoming rentals, cannot change location!",
                            },
                            status=400,
                        )
                    vehicle.location_id = data.get("location_id")
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
        
    elif request.method == "DELETE":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not vehicle_id:
                return Response(
                    {"success": 0, "message": "Vehicle ID is required"}, status=400
                )
            try:
                dealership = Dealership.objects.get(user=user.id)
                vehicle = Vehicle.objects.get(
                    vehicle_id=vehicle_id,
                    dealer=dealership,
                )
                vehicles = Vehicle.objects.filter(
                    dealer=dealership, model_id=vehicle.model_id
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
                        model=vehicle.model_id, dealer=dealership
                    )
                    offer.delete()
                vehicle.delete()
                return Response(
                    {"success": 1, "message": "Vehicle deleted successfully"},
                    status=200,
                )
            except Exception as e:
                print(e)
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


    elif request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                # Return: {registration, streetName, streetNo, cityName, location_id}
                vehicle = Vehicle.objects.get(
                    dealer=dealership,
                    vehicle_id=vehicle_id,
                )
                location = Location.objects.get(location_id=vehicle.location_id)
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
                        "message": "Vehicle does not exist!",
                    },
                    status=200,
                )


@login_required
@extend_schema(
    methods=["POST"],
    operation_id="post_company_vehicle",
    tags=["profile"],
    request=CompanyVehicleSerializer,
)
@api_view(["POST"])
def companyVehicle(request):
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
                dealership = Dealership.objects.get(user=user.id)
                model = Model.objects.get(model_id=data.get("model_id"))
                location = Location.objects.get(
                    location_id=data.get("location_id"),
                    dealership=dealership.dealership_id,
                )

                vehicle = Vehicle.objects.create(
                    model_id=model.model_id,
                    location_id=location.location_id,
                    dealer=dealership,
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


@extend_schema(
    methods=["GET"],
    operation_id="get_company_offer",
    tags=["profile"],
    responses={
        200: GetCompanyOffer,
    },
)
@extend_schema(
    methods=["PUT"],
    operation_id="put_company_offer",
    tags=["profile"],
    request=CompanyOfferPutSerializer,
)
@extend_schema(
    methods=["DELETE"], operation_id="delete_company_offer", tags=["profile"]
)
@api_view(["GET", "PUT", "DELETE"])
def getCompanyOffer(request, offerId):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                # , makeName, modelName,
                offer = Offer.objects.get(
                    dealer=dealership,
                    offer_id=offerId,
                )
                model = Model.objects.get(model_id=offer.model_id)
                retObject = {
                    "price": offer.price,
                    "image": (
                        request.build_absolute_uri(dealership.image.url)
                        if dealership.image
                        else None
                    ),
                    "description": offer.description,
                    "model_id": model.model_id,
                    "makeName": model.makeName,
                    "modelName": model.modelName,
                }
                return JsonResponse(retObject, status=200)
            except Exception as e:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no offers yet!",
                    },
                    status=404,
                )
    elif request.method == "PUT":
        user = request.user
        if user.is_authenticated:
            data = request.data
            try:
                dealership = Dealership.objects.get(user=user.id)
                offer = Offer.objects.get(
                    dealer=dealership,
                    offer_id=offerId,
                )
                if data.get("price"):
                    offer.price = data.get("price")
                if data.get("image"):
                    offer.image = request.FILES.get("image")
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
                    status=404,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )

    elif request.method == "DELETE":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if not offerId:
                return Response(
                    {"success": 0, "message": "Offer ID is required"}, status=400
                )
            try:
                dealership = Dealership.objects.get(user=user.id)
                offer = Offer.objects.get(
                    offer_id=offerId
                )
                offer.delete()
                return Response(
                    {"success": 1, "message": "Offer deleted successfully"}, status=200
                )
            except:
                return Response(
                    {
                        "success": 0,
                        "message": "Offer does not exist",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@extend_schema(
    methods=["POST"],
    operation_id="post_company_offer",
    tags=["profile"],
    request=CompanyOfferPostSerializer,
)
@login_required
@api_view(["POST"])
def companyOffer(request):
    if request.method == "POST":
        user = request.user
        if user.is_authenticated:
            data = request.data
            if (
                not data.get("price")
                or not request.FILES.get("image")
                or not data.get("description")
                or not data.get("model_id")
            ):
                return Response(
                    {"success": 0, "message": "All fields are required"}, status=400
                )
            try:
                dealership = Dealership.objects.get(user=user.id)
                model = Model.objects.get(model_id=data.get("model_id"))

                offer = Offer.objects.create(
                    model=model,
                    dealer=dealership,
                    price=data.get("price"),
                    image=request.FILES.get("image"),
                    description=data.get("description"),
                    noOfReviews=0,
                    rating=0,
                )
                offer.save()
                return Response(
                    {"success": 1, "message": "Offer added successfully"}, status=200
                )
            except Exception as e:
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or wrong vehicle id!",
                    },
                    status=200,
                )
        else:
            return Response(
                {"success": 0, "message": "User not authenticated"}, status=401
            )


@extend_schema(
    methods=["GET"],
    operation_id="get_company_vehicle_log",
    tags=["profile"],
    responses={
        200: GetCompanyVehicleLog(),
    },
)
@login_required
@api_view(["GET"])
def companyVehicleLog(request, vehicle_id):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                vehicle = Vehicle.objects.get(vehicle_id=vehicle_id)
                model = Model.objects.get(model_id=vehicle.model_id)
                location = Location.objects.get(location_id=vehicle.location_id)
                rents = Rent.objects.filter(vehicle_id=vehicle_id)
                rentCount = 0
                rentTime = 0
                moneyMade = 0
                onGoing = {}
                for rent in rents:
                    rentoid = Rentoid.objects.get(rentoid_id=rent.rentoid_id)
                    rentUser = User.objects.get(id=rentoid.user_id)
                    rentLocation = Location.objects.get(
                        location_id=rent.rentedLocation_id
                    )
                    returnLocation = Location.objects.get(
                        location_id=rent.returnLocation_id
                    )
                    if rent.dateTimeReturned >= (make_aware(datetime.now()) if datetime.now().tzinfo is None else datetime.now()) and rent.dateTimeRented <= (make_aware(datetime.now()) if datetime.now().tzinfo is None else datetime.now()):
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
                        (make_aware(rent.dateTimeReturned) if rent.dateTimeReturned.tzinfo is None else rent.dateTimeReturned) - 
                        (make_aware(rent.dateTimeRented) if rent.dateTimeRented.tzinfo is None else rent.dateTimeRented)
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
            except Exception as e:
                print(e)
                return Response(
                    {
                        "success": 0,
                        "message": "Company does not exist or has no vehicles yet!",
                    },
                    status=200,
                )


@extend_schema(
    methods=["GET"],
    operation_id="get_company_log_upcoming",
    tags=["profile"],
    responses={
        200: GetCompanyLog(many=True),
    },
    parameters=[
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page as integer",
            required=False,
            default=1,
        ),
        OpenApiParameter(
            name="limit",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Limit as integer",
            required=False,
            default=1,
        ),
    ],
)
@login_required
@api_view(["GET"])
def companyLogUpcoming(request, vehicle_id):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                rents = Rent.objects.filter(
                    dealer=dealership,
                    vehicle=vehicle_id,
                )
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                res = []
                for i, rent in enumerate(rents):
                    rentDateTimeRented = rent.dateTimeRented
                    if rent.dateTimeRented < make_aware(datetime.now()):
                        continue
                    rentoid = Rentoid.objects.get(rentoid_id=rent.rentoid_id)
                    rentUser = User.objects.get(id=rentoid.user_id)
                    if rent.dateTimeRented >= make_aware(datetime.now()):
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
                    status=404,
                )


@extend_schema(
    methods=["GET"],
    operation_id="get_company_log_completed",
    tags=["profile"],
    responses={
        200: GetCompanyLog(many=True),
    },
    parameters=[
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page as integer",
            required=False,
            default=1,
        ),
        OpenApiParameter(
            name="limit",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Limit as integer",
            required=False,
            default=1,
        ),
    ],
)
@login_required
@api_view(["GET"])
def companyLogCompleted(request, vehicle_id):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                dealership = Dealership.objects.get(user=user.id)
                rents = Rent.objects.filter(dealer=dealership, vehicle_id=vehicle_id)
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                res = []
                for rent in rents:
                    if rent.dateTimeReturned <= make_aware(datetime.now()):
                        rentoid = Rentoid.objects.get(rentoid_id=rent.rentoid_id)
                        rentUser = User.objects.get(id=rentoid.user_id)
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


@extend_schema(
    methods=["GET"],
    operation_id="get_company_log_reviews",
    tags=["profile"],
    responses={
        200: GetCompanyLogReviews(many=True),
    },
)
@login_required
@api_view(["GET"])
def companyLogReviews(request, vehicle_id):
    if request.method == "GET":
        user = request.user
        if user.is_authenticated:
            try:
                page = int(request.GET.get("page", 1))
                limit = int(request.GET.get("limit", 10))
                dealership = Dealership.objects.get(user=user.id)
                rents = Rent.objects.filter(dealer=dealership, vehicle=vehicle_id)
                res = []
                for rent in rents:
                    if rent.vehicle_id != vehicle_id:
                        continue
                    review = Review.objects.get(rent_id=rent.rent_id)
                    rentoid = Rentoid.objects.get(rentoid_id=rent.rentoid_id)
                    rentUser = User.objects.get(id=rentoid.user_id)

                    item = {
                        "firstName": rentUser.first_name,
                        "lastName": rentUser.last_name,
                        "date": review.reviewDate,
                        "description": review.description,
                        "rating": review.rating,
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
                    status=404,
                )
