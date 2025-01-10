from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django import forms
import random
from .models import *
from .serializers import *
from src.models import *
from src.serializers import *
from django.db.models import F, ExpressionWrapper, DecimalField, Q, Max
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.utils.timezone import now
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiExample, OpenApiParameter
from datetime import date, datetime, timedelta
import re

#extend_schema has to come before api_view
#tag defines the category in SwaggerUI and responses are examples of responses that can be returned
@extend_schema(
    tags=['home'],
    responses={
        200: OfferDetailsSerializer,
        404: OpenApiResponse(
            description='Offer Not Found',
            examples=[
                OpenApiExample(
                    'Offer Not Found',
                    value={"error": "Offer not found"},
                ),
            ],
        ),
    },
)
@api_view(['GET'])
def getOfferDetails(request, offer_id):
    try:
        offer = Offer.objects.get(pk=offer_id)
        dealership = offer.dealer

        response_data = {
            "image": base64.b64encode(offer.image).decode('utf-8'),  # Convert bytes to string
            "makeName": offer.model.makeName,
            "modelName": offer.model.modelName,
            "companyName": dealership.user.first_name,
            "dealership_id": dealership.dealership_id,
            "noOfSeats": offer.model.noOfSeats,
            "modelType": offer.model.modelType.modelTypeName,
            "automatic": offer.model.automatic,
            "price": offer.price,
            "rating": offer.rating,
            "noOfReviews": offer.noOfReviews,
            "companyLogo": base64.b64encode(dealership.image).decode('utf-8'),
            "description": offer.description
        }

        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offer not found"}, status=404)
#Ivan Dujmić's function
def canUserReview(user, rental):
    oneMonthAfterExpiry = rental.dateTimeReturned + timedelta(days=30)
    hasReviewed = Review.objects.filter(user=user, rental=rental).exists()
    return rental.dateTimeReturned < now() and not hasReviewed and now() <= oneMonthAfterExpiry

@extend_schema(
    tags=['home'],
)
@api_view(["GET"])
def get_showcased(request):
    # Session debug
    # for session in sessions:
    #     if session.session_key == "e77fbr34a70emfsfow7veg5y1ifjst91":
    #         print(session.session_key, session.get_decoded())
    # for session in sessions:
    #     data = session.get_decoded()
    #     print(data)
    #     print("Session: ", session.session_key)
    # print("Trenutni: ", request.session.session_key)

    dealerships = list(Dealership.objects.all())
    size = 6 if len(dealerships) >= 6 else len(dealerships)
    showcased_dealerships = random.sample(dealerships, size)

    offers = Offer.objects.all()
    most_popular = offers.order_by("-noOfReviews")[:5]
    best_value = offers.order_by("price")[:5]

    showcased_dealership_data = DealershipLogoSerializer(
        showcased_dealerships, many=True
    ).data
    most_popular_data = OfferCardSerializer(most_popular, many=True).data
    best_value_data = OfferCardSerializer(best_value, many=True).data

    response_data = {
        "showcased_dealerships": showcased_dealership_data,
        "most_popular": most_popular_data,
        "best_value": best_value_data,
    }

    return Response(response_data)


@extend_schema(
    tags=['home'],
    responses={
        200: LocationListSerializer,
        404: OpenApiResponse(
            description='Locations Not Found',
            examples=[
                OpenApiExample(
                    'Location Not Found',
                    value={"error": "Locations not found"},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
def getLocations(request):
    try:
        response_array = []
        locations = Location.objects.all()
        for location in locations:
            response_array.append({
            "companyName" : location.dealership.user.first_name,
            "dealership_id" : location.dealership.dealership_id,
            "streetName" : location.streetName,
            "streetNo" : location.streetNo,
            "cityName" : location.cityName,
            "latitude" : location.latitude,
            "longitude" : location.longitude,
            "location_id" : location.location_id
        })
        if len(response_array) == 0:
            return Response({"error": "Locations not found"}, status=404)
        response_data = {"locations" : response_array}
        return JsonResponse(response_data, status=200)
    except Location.DoesNotExist:
        return Response({"error": "Locations not found"}, status=404)


@extend_schema(
    tags=['home'],
    responses={
        200: MakeModelListSerializer,
        404: OpenApiResponse(
            description='Makes Not Found',
            examples=[
                OpenApiExample(
                    'Makes Not Found',
                    value={"error": "Makes not found"},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
def getModels(request):
    try:
        makeModel = {}
        response_array = []
        makes = Model.objects.all()
        for make in makes:
            if make.makeName not in makeModel:
                makeModel[make.makeName] = []
            makeModel[make.makeName].append({"modelName" : make.modelName, "model_id" : make.model_id})
        for makeName, modelList in makeModel.items():
            response_array.append({
                "makeName" : makeName,
                "models" : modelList 
            }
            )
        if len(response_array) == 0:
            return Response({"error": "Makes not found"}, status=404)
        response_data = {"makes" : response_array}
        return JsonResponse(response_data, status=200)
    except Model.DoesNotExist:
        return Response({"error": "Makes not found"}, status=404)
    


@extend_schema(
    tags=['home'],
    responses={
        200: DealershipSerializer,
        404: OpenApiResponse(
            description='Company Not Found',
            examples=[
                OpenApiExample(
                    'Company Not Found',
                    value={"error": "Company not found"},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
def getCompany(request, dealership_id):
    try:
        response_data = {}
        if (dealership_id == None):
            return Response({"error": "Company not found"}, status=404)
        company = Dealership.objects.get(pk = dealership_id)
        locations = Location.objects.filter(dealership_id = company.dealership_id).all()
        location_array = []
        for location in locations:
            location_array.append({
            "streetName" : location.streetName,
            "streetNo" : location.streetNo,
            "cityName" : location.cityName,
            "latitude" : location.latitude,
            "longitude" : location.longitude,
            "isHQ" : location.isHQ 
        })
        response_data = {
            "companyLogo" : base64.b64encode(company.image),
            "companyName" : company.user.first_name,
            "dealership_id" : company.dealership_id,
            "description" : company.description,
            "locations" : location_array
        }
        return JsonResponse(response_data, status=200)
    except Dealership.DoesNotExist:
        return Response({"error": "Company not found"}, status=404)
    

@extend_schema(
    tags=['home'],
    responses={
        200: OfferListSerializer,
        404: OpenApiResponse(
            description='Offers Not Found',
            examples=[
                OpenApiExample(
                    'Offers Not Found',
                    value={"error": "Offers not found"},
                ),
            ],
        ),
    },
    parameters=[
        OpenApiParameter(
            name='page',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Page number, starts with 1',
            required=False,
            default=1
        ),
        OpenApiParameter(
            name='limit',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Max number of offers per page',
            required=False,
            default=10
        ),
    ]
)

@api_view(["GET"])
def getOffersForCompany(request, dealership_id):
    try:
        page = request.GET.get("page")
        if page == None or not page.isdigit() or int(page) <= 0:
            page = 1
        limit = request.GET.get("limit")
        if limit == None or not limit.isdigit() or int(limit) <= 0:
            limit = 10
        if (dealership_id == None or not dealership_id.isdigit()):
            return Response({"error": "Offers not found"}, status=404)
        page = int(page)
        limit = int(limit)
        response_data = {}
        offer_array = []
        offset = (page - 1) * limit
        offers = Offer.objects.filter(dealer = dealership_id).all()[offset:offset+limit]
        for offer in offers:
            offer_array.append({
            "image" : base64.b64encode(offer.image),
            "makeName" : offer.model.makeName,
            "modelName" : offer.model.modelName,
            "noOfSeats" : offer.model.noOfSeats,
            "automatic" : offer.model.automatic,
            "price" : offer.price,
            "rating" : offer.rating,
            "noOfReviews" : offer.noOfReviews,
            "offer_id" : offer.offer_id 
        })
        if len(offer_array) == 0:
            return Response({"error": "Offers not found"}, status=404)
        response_data = {
            "offers" : offer_array
        }
        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offers not found"}, status=404)
    


@extend_schema(
    tags=['home'],
    responses={
        200: ShowcasedCompanyListSerializer,
        404: OpenApiResponse(
            description='Companies Not Found',
            examples=[
                OpenApiExample(
                    'Companies Not Found',
                    value={"error": "Companies not found"},
                ),
            ],
        ),
    },
     parameters=[
        OpenApiParameter(
            name='limit',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Max number of companies that will be returned',
            required=False,
            default=8
        )
     ]
)
@api_view(["GET"])
def getShowcasedCompanies(request):
    try:
        response_data = {}
        limit = request.GET.get("limit")
        if limit == None or not limit.isdigit() or int(limit) <= 0:
            limit = 8
        companies = Dealership.objects.all()[:int(limit)]
        company_array = []
        for company in companies:
            company_array.append({
                "companyName" : company.user.first_name,
                "companyLogo" : base64.b64encode(company.image),
                "dealership_id" : company.dealership_id,
            })
        if len(company_array) == 0:
            return Response({"error": "Companies not found"}, status=404)
        response_data = {
            "companies" : company_array
        }
        return JsonResponse(response_data, status=200)
    except Dealership.DoesNotExist:
        return Response({"error": "Companies not found"}, status=404)
    

@extend_schema(
    tags=['home'],
    responses={
        200: SearchedOffersListSerializer,
        404: OpenApiResponse(
            description='Offers Not Found',
            examples=[
                OpenApiExample(
                    'Offers Not Found',
                    value={"error": "Offers not found"},
                ),
            ],
        ),
    },
    parameters=[
        OpenApiParameter(
            name='page',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Page number, starts with 1',
            required=False,
            default=1
        ),
        OpenApiParameter(
            name='limit',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Max number of offers per page',
            required=False,
            default=10
        ),
    ]
)

@api_view(["GET"])
def getMostPopularOffers(request):
    try:
        page = request.GET.get("page")
        if page == None or not page.isdigit() or int(page) <= 0:
            page = 1
        limit = request.GET.get("limit")
        if limit == None or not limit.isdigit() or int(limit) <= 0:
            limit = 10
        page = int(page)
        limit = int(limit)
        response_data = {}
        offer_array = []
        offset = (page - 1) * limit
        offers = Offer.objects.order_by('-noOfReviews').all()[offset:offset+limit]
        for offer in offers:
            offer_array.append({
            "image" : base64.b64encode(offer.image),
            "companyName" : offer.dealer.user.first_name,
            "makeName" : offer.model.makeName,
            "modelName" : offer.model.modelName,
            "noOfSeats" : offer.model.noOfSeats,
            "automatic" : offer.model.automatic,
            "price" : offer.price,
            "rating" : offer.rating,
            "noOfReviews" : offer.noOfReviews,
            "offer_id" : offer.offer_id 
        })
            
        if len(offer_array) == 0:
            return Response({"error": "Offers not found"}, status=404)
        response_data = {
            "offers" : offer_array
        }
        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offers not found"}, status=404)
    


@extend_schema(
    tags=['home'],
    responses={
        200: SearchedOffersListSerializer,
        404: OpenApiResponse(
            description='Offers Not Found',
            examples=[
                OpenApiExample(
                    'Offers Not Found',
                    value={"error": "Offers not found"},
                ),
            ],
        ),
    },
    parameters=[
        OpenApiParameter(
            name='page',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Page number, starts with 1',
            required=False,
            default=1
        ),
        OpenApiParameter(
            name='limit',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Max number of offers per page',
            required=False,
            default=10
        ),
    ]
)

@api_view(["GET"])
def getBestValueOffers(request):
    try:
        page = request.GET.get("page")
        if page == None or not page.isdigit() or int(page) <= 0:
            page = 1
        limit = request.GET.get("limit")
        if limit == None or not limit.isdigit() or int(limit) <= 0:
            limit = 10
        page = int(page)
        limit = int(limit)
        response_data = {}
        offer_array = []
        offset = (page - 1) * limit
        offers = Offer.objects.annotate(value=ExpressionWrapper(F('rating') / F('price'), output_field=DecimalField()
    )).order_by("-value").all()[offset:offset+limit]
        for offer in offers:
            offer_array.append({
            "image" : base64.b64encode(offer.image),
            "companyName" : offer.dealer.user.first_name,
            "makeName" : offer.model.makeName,
            "modelName" : offer.model.modelName,
            "noOfSeats" : offer.model.noOfSeats,
            "automatic" : offer.model.automatic,
            "price" : offer.price,
            "rating" : offer.rating,
            "noOfReviews" : offer.noOfReviews,
            "offer_id" : offer.offer_id 
        })
        if len(offer_array) == 0:
            return Response({"error": "Offers not found"}, status=404)
        response_data = {
            "offers" : offer_array
        }
        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offers not found"}, status=404)
    
@extend_schema(
    tags=['home'],
    responses={
        200: CountryListSerializer,
        404: OpenApiResponse(
            description='Cities Not Found',
            examples=[
                OpenApiExample(
                    'Cities Not Found',
                    value={"error": "Cities not found"},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
def getCities(request):
    try:
        countryCity = {}
        response_array = []
        locations = Location.objects.all()
        for location in locations:
            if not countryCity.__contains__(location.countryName):
                countryCity[location.countryName] = []
            countryCity[location.countryName].append({"cityName" : location.cityName})
        for country, cityList in countryCity.items():
            response_array.append({
                "countryName" : country,
                "cities" : cityList 
            }
            )
        if len(response_array) == 0: 
            return Response({"error": "Cities not found"}, status=404)
        response_data = {"countries" : response_array}
        return JsonResponse(response_data, status=200)
    except Location.DoesNotExist:
        return Response({"error": "Cities not found"}, status=404)
    



@extend_schema(
    tags=['home'],
    responses={
        200: SearchedOffersListSerializer,
        404: OpenApiResponse(
            description='Offers Not Found',
            examples=[
                OpenApiExample(
                    'Offers Not Found',
                    value={"error": "Offers not found"},
                ),
            ],
        ),
    },
    parameters=[
        OpenApiParameter(
            name='page',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Page number, starts with 1',
            required=False,
            default=1
        ),
        OpenApiParameter(
            name='limit',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Max number of offers per page',
            required=False,
            default=10
        ),
                OpenApiParameter(
            name='pick_up_location',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Format: cityName-countryName',
            required=True,
            default='Obrera-Mexico'
        ),
                OpenApiParameter(
            name='drop_off_location',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Format: cityName-countryName',
            required=False,
            default='Corbetta-Italy'
        ),
                OpenApiParameter(
            name='pick_up_date',
            type=date,
            location=OpenApiParameter.QUERY,
            description='Format: year-month-day, zero padded',
            required=True,
            default='2012-05-03'
        ),
                OpenApiParameter(
            name='pick_up_time',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Hour between 0-23, but will only give results if it is during the working hours of the company',
            required=True,
            default=14
        ),
                OpenApiParameter(
            name='drop_off_date',
            type=date,
            location=OpenApiParameter.QUERY,
            description='Format: year-month-day, zero padded',
            required=True,
            default='2220-06-15'
        ),
                OpenApiParameter(
            name='drop_off_time',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Hour between 0-23, but will only give results if it is during the working hours of the company',
            required=True,
            default=16
        ),
                        OpenApiParameter(
            name='seats',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Number of seats',
            required=False,
            default=5
        ),
                        OpenApiParameter(
            name='car_type',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Suv, Limo or Compact',
            required=False,
            default='Suv'
        ),
                        OpenApiParameter(
            name='automatic',
            type=bool,
            location=OpenApiParameter.QUERY,
            description='True if automatic, false if manual',
            required=False,
            default=False
        ),
                        OpenApiParameter(
            name='min_price',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Min price per day',
            required=False,
            default=14
        ),
                        OpenApiParameter(
            name='max_price',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Max price per day',
            required=False,
            default=15
        ),
                        OpenApiParameter(
            name='make',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Car make',
            required=False,
            default='Volkswagen'
        ),
                        OpenApiParameter(
            name='model',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Car model',
            required=False,
            default='Tiguan'
        )
    ]
)
@api_view(["GET"])
def getFilteredOffers(request):
    try:
        #check page and limit
        page = request.GET.get("page")
        if page == None or not page.isdigit() or int(page) <= 0:
            page = 1
        limit = request.GET.get("limit")
        if limit == None or not limit.isdigit() or int(limit) <= 0:
            limit = 10
        page = int(page)
        limit = int(limit)
        pick_up_location = request.GET.get("pick_up_location")
        drop_off_location = request.GET.get("drop_off_location")
        pick_up_date = request.GET.get("pick_up_date")
        pick_up_time = request.GET.get("pick_up_time")
        drop_off_date = request.GET.get("drop_off_date")
        drop_off_time = request.GET.get("drop_off_time")
        #check if required fields are filled
        if (pick_up_location == None or pick_up_date == None
             or pick_up_time == None or drop_off_date == None or drop_off_time == None):
            return Response({"error": "Required fields not filled"}, status=404)
        #check if times are valid
        try:
            pick_up_time = int(pick_up_time)
            drop_off_time = int(drop_off_time)
        except:
            return Response({"error": "Invalid time format"}, status=404)
        if (pick_up_time < 0 or pick_up_time > 24 or drop_off_time < 0 or drop_off_time > 24):
            return Response({"error": "Invalid time format"}, status=404)
        #check if dates are valid
        date_format = "%Y-%m-%d"
        try:
            pick_up_date = datetime.strptime(pick_up_date, date_format).date()
            drop_off_date = datetime.strptime(drop_off_date, date_format).date()
        except ValueError:
            return Response({"error": "Invalid date format"}, status=404)
        #check if location format is valid
        if not re.match("^[a-zA-Z ]+-[a-zA-Z ]+$", pick_up_location):
            return Response({"error": "Invalid location format"}, status=404)
        pick_up_cityName = pick_up_location.split("-")[0]
        pick_up_countryName = pick_up_location.split("-")[1]
        seats = request.GET.get("seats")
        car_type = request.GET.get("car_type")
        automatic = request.GET.get("automatic")
        min_price = request.GET.get("min_price")
        max_price = request.GET.get("max_price")
        make = request.GET.get("make")
        model = request.GET.get("model")
        #get offers at the pick up location
        pick_up_locations = Location.objects.filter(cityName=pick_up_cityName, countryName=pick_up_countryName)
        #remove locations that are closed at pick up time
        working_hours = WorkingHours.objects.filter(location__in=pick_up_locations).filter(dayOfTheWeek=pick_up_date.weekday()) 
        working_hours = working_hours.filter(startTime__lte=pick_up_time, endTime__gte=pick_up_time)
        pick_up_locations = pick_up_locations.filter(location_id__in=working_hours.values_list('location_id', flat=True))
        if pick_up_locations.count() == 0:
            return Response({"error": "No locations are open at the specified pickup time"}, status=404) 
        pick_up_dealers_list = pick_up_locations.distinct('dealership_id').values_list('dealership_id', flat=True)
        pick_up_dealers = Dealership.objects.filter(dealership_id__in=pick_up_dealers_list)
        #if drop off location exists, check if it is owned by the same dealer
        if drop_off_location != None:
            if not re.match("^[a-zA-Z ]+-[a-zA-Z ]+$", drop_off_location):
                return Response({"error": "Invalid location format"}, status=404)
            drop_off_cityName = drop_off_location.split("-")[0]
            drop_off_countryName = drop_off_location.split("-")[1]
            drop_off_locations = Location.objects.filter(cityName=drop_off_cityName, countryName=drop_off_countryName)
            # remove locations that are closed at drop off time
            working_hours = WorkingHours.objects.filter(location__in=drop_off_locations).filter(dayOfTheWeek=drop_off_date.weekday())
            working_hours = working_hours.filter(startTime__lte=drop_off_time, endTime__gte=drop_off_time)
            drop_off_locations = drop_off_locations.filter(location_id__in=working_hours.values_list('location_id', flat=True))
            if drop_off_locations.count() == 0:
                return Response({"error": "No locations are open at the specified dropoff time"}, status=404)
            drop_off_dealers_list = drop_off_locations.distinct('dealership_id').values_list('dealership_id', flat=True)
            pick_up_dealers = pick_up_dealers.filter(dealership_id__in=drop_off_dealers_list)
            if pick_up_dealers.count() == 0:
                return Response({"error": "Pick up and drop off locations are not owned by the same dealer"}, status=404)
        #get offers for specified location/dealers
        offers = Offer.objects.filter(dealer__in=pick_up_dealers)
        #filter by seats
        if seats != None:
            offers = offers.filter(model__noOfSeats=seats)
        #filter by car type
        if car_type != None:
            offers = offers.filter(model__modelType__modelTypeName=car_type.capitalize())
        #filter by automatic
        if automatic != None:
            automatic = True if automatic.lower() == "true" else False
            offers = offers.filter(model__automatic=automatic)
        #filter by price
        if min_price != None:
            offers = offers.filter(price__gte=min_price)
        if max_price != None:
            offers = offers.filter(price__lte=max_price)
        #filter by make
        if make != None:
            offers = offers.filter(model__makeName=make)
        #filter by model
        if model != None:
            offers = offers.filter(model__modelName=model)
            
        #check if any vehicles are available for the specified time period, we will get all vehicles that
        #are parts of offers that are available for the specified time period, that are at the pick up location
        #and that are owned by the dealers that own the pick up and drop off locations

        model_id_list = offers.distinct('model_id').values_list('model_id', flat=True)
        vehicles = Vehicle.objects.filter(model__in=model_id_list)
        #we need to filter both by pick up locations and possible dealers. If we only filter by pick up locations
        #we might get vehicles that do not belong to one of the dealers that own the pick up and drop off locations
        #if we only filter by dealers, we might get vehicles that are not at the pick up location
        vehicles = vehicles.filter(location__in=pick_up_locations).filter(dealer__in=pick_up_dealers)
        pick_up_datetime = datetime.combine(pick_up_date, datetime.min.time()) + timedelta(hours=pick_up_time)
        drop_off_datetime = datetime.combine(drop_off_date, datetime.min.time()) + timedelta(hours=drop_off_time)
        active_rents = Rent.objects.filter(Q(dateTimeRented__lte=pick_up_datetime, dateTimeReturned__gte=pick_up_datetime) |
        Q(dateTimeRented__lte=drop_off_datetime, dateTimeReturned__gte=drop_off_datetime)).filter(vehicle__in=vehicles)
        rented_vehicles = active_rents.distinct('vehicle_id').values_list('vehicle_id', flat=True)
        available_vehicles = vehicles.exclude(vehicle_id__in=rented_vehicles)
        #we will get all offers that are part of available vehicles
        offers_list = []
        for offer in offers:
            if available_vehicles.filter(model=offer.model).filter(dealer=offer.dealer).exists():
                offers_list.append(
                    {
                        "image" : base64.b64encode(offer.image),
                        "companyName" : offer.dealer.user.first_name,
                        "makeName" : offer.model.makeName,
                        "modelName" : offer.model.modelName,
                        "noOfSeats" : offer.model.noOfSeats,
                        "automatic" : offer.model.automatic,
                        "price" : offer.price,
                        "rating" : offer.rating,
                        "noOfReviews" : offer.noOfReviews,
                        "offer_id" : offer.offer_id 
                    }
                )
        list_len = len(offers_list)
        if list_len == 0:
            return Response({"error": "Offers not found"}, status=404)
        offset = (page - 1) * limit
        if list_len < offset + limit + 1:
            last = True
        response_data = {"offers" : offers_list[offset:offset+limit],
                         "last" : last}
        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offers not found"}, status=404)


@extend_schema(
    tags=['home'],
    responses={
        200: ReviewListSerializer,
        404: OpenApiResponse(
            description='Reviews Not Found',
            examples=[
                OpenApiExample(
                    'Reviews Not Found',
                    value={"error": "Reviews not found"},
                ),
            ],
        ),
    },
     parameters=[
        OpenApiParameter(
            name='page',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Page number, starts with 1',
            required=False,
            default=1
        ),
        OpenApiParameter(
            name='limit',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Max number of reviews that will be returned',
            required=False,
            default=8
        )
     ]
)
#TEST
@api_view(["GET"])
def getReviews(request, offer_id):
    try:
        response_data = {}
        limit = request.GET.get("limit")
        if limit == None or not limit.isdigit() or int(limit) <= 0:
            limit = 8
        page = request.GET.get("page")
        if page == None or not page.isdigit() or int(page) <= 0:
            page = 1
        page = int(page)
        limit = int(limit)
        offset = (page - 1) * limit
        offer = Offer.objects.get(pk=offer_id)
        rentals = Rent.objects.filter(vehicle__dealer=offer.dealer).filter(vehicle__model=offer.model).values('rent_id')
        reviews = Review.objects.filter(rent__in=rentals).all()[offset:offset+limit]
        if reviews.count() < offset + limit + 1:
            last = True
        review_array = []
        for review in reviews:
            review_array.append({
                "rating" : review.rating,
                "firstName" : review.rent.rentoid.user.first_name,
                "lastName" : review.rent.rentoid.user.last_name,
                "reviewDate" : review.reviewDate,
                "description" : review.description,
            })
        if len(review_array) == 0:
            return Response({"error": "No reviews not found"}, status=404)
        response_data = {
            "reviews" : review_array,
            "last" : last
        }
        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offer not found"}, status=404)
    

@extend_schema(
    tags=['home'],
    responses={
        200: ReviewListSerializer,
        404: OpenApiResponse(
            description='Locations Not Found',
            examples=[
                OpenApiExample(
                    'Locations Not Found',
                    value={"error": "Locations not found"},
                ),
            ],
        ),
    }
    # we probably won't need this, but I'll leave it here for now
   #  parameters=[
   #     OpenApiParameter(
   #         name='pickUpDate',
   #         type=date,
   #         location=OpenApiParameter.QUERY,
   #         description='Format year-month-day, zero padded, required if pickUpTime is specified',
   #         required=False,
   #         default='2022-05-03'
   #     ),
   #     OpenApiParameter(
   #         name='pickUpTime',
   #         type=int,
   #         location=OpenApiParameter.QUERY,
   #         description='Hour between 0-23, required if pickUpDate is specified',
    #        required=False,
    #        default=14
    #    )
    # ]
)
#TEST IT
@api_view(["GET"])
def getLocationsForOffer(request, offer_id):
    try:
        response_data = {}
        offer = Offer.objects.get(pk=offer_id)
        pickUpDate = request.GET.get("pickUpDate")
        pickUpTime = request.GET.get("pickUpTime")
        date_format = "%Y-%m-%d"
        pickUpDateTime = None
        #check pick up date and time
        if pickUpDate != None:
            try:
                pickUpDate = datetime.strptime(pickUpDate, date_format).date()
            except ValueError:
                return Response({"error": "Invalid date format"}, status=404)
            if pickUpTime  == None:
                return Response({"error": "Pick up time not specified"}, status=404)
            try:
                pickUpTime = int(pickUpTime)
            except:
                return Response({"error": "Invalid time format"}, status=404)
            if pickUpTime < 0 or pickUpTime > 23:
                return Response({"error": "Invalid time format"}, status=404)
            pickUpDateTime = datetime.combine(pickUpDate, datetime.min.time()) + timedelta(hours=pickUpTime)   
        #get all vehicles that belong to the offer
        vehicles = Vehicle.objects.filter(model=offer.model).filter(dealer=offer.dealer)
        # get all active rents for the vehicles if pick up date and time are specified, exclude vehicles that are rented at that time
        if pickUpDateTime != None:
            active_rents = Rent.objects.filter(vehicle__in=vehicles).filter(dateTimeRented__lte=pickUpDateTime, dateTimeReturned__gte=pickUpDateTime)
            rented_vehicles = active_rents.values_list('vehicle', flat=True)
            vehicles = vehicles.exclude(vehicle_id__in=rented_vehicles)
        #get all locations for the vehicles
        locations = Location.objects.filter(vehicle__in=vehicles).distinct()
        #if pick up date and time are specified, check if the locations are open
        locations_array = []
        if pickUpDateTime != None:
            for location in locations:
                print(location)
                working_hours = WorkingHours.objects.filter(location=location).filter(dayOfTheWeek=pickUpDate.weekday())
                if working_hours.count() != 0:
                    opening_time = working_hours[0].startTime.hour
                    closing_time = working_hours[0].endTime.hour
                    if (opening_time <= pickUpTime <= closing_time):
                        locations_array.append({
                            "streetName" : location.streetName,
                            "streetNo" : location.streetNo,
                            "cityName" : location.cityName,
                            "latitude" : location.latitude,
                            "longitude" : location.longitude,
                            "isHQ" : location.isHQ,
                            "location_id" : location.location_id
                        })
        else:
            for location in locations:
                locations_array.append({
                    "streetName" : location.streetName,
                    "streetNo" : location.streetNo,
                    "cityName" : location.cityName,
                    "latitude" : location.latitude,
                    "longitude" : location.longitude,
                    "isHQ" : location.isHQ,
                    "location_id" : location.location_id
                })
        if len(locations_array) == 0:
            return Response({"error": "No locations available"}, status=404)
        response_data = {
            "locations" : locations_array
        }
        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offer not found"}, status=404)

@extend_schema(
    tags=['home'],
    responses={
        200: UnavailablePickupSerializer,
        404: OpenApiResponse(
            description='Vehicles Not Found',
            examples=[
                OpenApiExample(
                    'Vehicles Not Found',
                    value={"error": "Vehicles not found"},
                ),
            ],
        ),
    },
     parameters=[
        OpenApiParameter(
            name='pickUpLocationId',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Id of the pick up location',
            required=True,
            default='2'
        )
     ]
)
@api_view(["GET"])
def getUnavailablePickupTimes(request, offer_id):
    response_data = {}
    pickUpLocationId = request.GET.get("pickUpLocationId")
    #check if required fields are filled
    if pickUpLocationId == None:
        return Response({"error": "Required fields not filled"}, status=404)
    #check if locations exist
    try:
        pickUpLocation = Location.objects.get(pk=pickUpLocationId)
    except Location.DoesNotExist:
        return Response({"error": "Location not found"}, status=404)
    try:
        offer = Offer.objects.get(pk=offer_id)
    except Offer.DoesNotExist:
        return Response({"error": "Offer not found"}, status=404)
    workingHours = WorkingHours.objects.filter(location=pickUpLocation)
    vehicles = Vehicle.objects.filter(location=pickUpLocation).filter(dealer=offer.dealer).filter(model=offer.model)
    all_rentals = Rent.objects.filter(vehicle__in=vehicles)
    currentDateTime = datetime.now()
    currentDateTime = currentDateTime.replace(hour = currentDateTime.hour + 1, minute=0, second=0, microsecond=0)
    finalDateTime = all_rentals.aggregate(Max('dateTimeReturned'))['dateTimeReturned__max']
    unavailable_pickup_times = []
    interval_start = None
    interval_end = None
    while (currentDateTime < finalDateTime):
        closedDay = False
        unavailable_vehicles = 0
        currentWorkingHours = workingHours.filter(dayOfTheWeek=currentDateTime.weekday())
        #if there are no working hours for the current day, we will skip to the next openining hours
        while currentWorkingHours.count() == 0:
            closedDay = True
            currentDateTime = currentDateTime.replace(hour=0) + timedelta(days=1)
            currentWorkingHours = workingHours.filter(dayOfTheWeek=currentDateTime.weekday())
        if closedDay:
            currentDateTime = currentDateTime.replace(hour=currentWorkingHours[0].startTime.hour)
        #if the current time is before the opening hours, we will skip to the opening hours 
        if currentDateTime.hour < currentWorkingHours[0].startTime.hour:
            currentDateTime = currentDateTime.replace(hour=currentWorkingHours[0].startTime.hour)
        #if the current time is after the closing hours, we will skip to the next opening hours
        if currentDateTime.hour > currentWorkingHours[0].endTime.hour:
            currentDateTime = currentDateTime.replace(hour=0) + timedelta(days=1)
            while workingHours.filter(dayOfTheWeek=currentDateTime.weekday()).count() == 0:
                currentDateTime = currentDateTime + timedelta(days=1)
            currentDateTime = currentDateTime.replace(hour=workingHours.filter(dayOfTheWeek=currentDateTime.weekday())[0].startTime.hour)
        for vehicle in vehicles:
            vehicle_rents = all_rentals.filter(vehicle=vehicle).filter(dateTimeRented__lte=currentDateTime, dateTimeReturned__gte=currentDateTime)
            if vehicle_rents.count() != 0:
                unavailable_vehicles += 1

        if unavailable_vehicles == vehicles.count():
            if interval_start == None:
                interval_start = currentDateTime
        else:
            if interval_start != None:
                interval_end = currentDateTime - timedelta(hours=1)
                unavailable_pickup_times.append({
                    "start" : interval_start,
                    "end" : interval_end
                })
                interval_start = None
        currentDateTime = currentDateTime + timedelta(hours=1)
    if interval_start != None:
        unavailable_pickup_times.append({
            "start" : interval_start,
            "end" : finalDateTime
        })
    # we also need to return the working hours of the pick up location
    workingHoursArray = []
    for workingHour in workingHours:
        workingHoursArray.append({
            "dayOfTheWeek" : workingHour.dayOfTheWeek,
            "startTime" : workingHour.startTime,
            "endTime" : workingHour.endTime
        })
    response_data = {
        "unavailablePickupTimes" : unavailable_pickup_times,
        "workingHours" : workingHoursArray
    }
    return JsonResponse(response_data, status=200)



@extend_schema(
    tags=['home'],
    responses={
        200: AvailableDropOffSerializer,
        404: OpenApiResponse(
            description='Vehicle Not Found',
            examples=[
                OpenApiExample(
                    'Vehicle Not Found',
                    value={"error": "Vehicle not found"},
                ),
            ],
        ),
    },
     parameters=[
        OpenApiParameter(
            name='pickUpLocationId',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Id of the pick up location',
            required=True,
            default='2'
        ),
        OpenApiParameter(
            name='dropOffLocationId',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Id of the drop off location',
            required=True,
            default='2'
        ),
        OpenApiParameter(
            name='pickUpDate',
            type=date,
            location=OpenApiParameter.QUERY,
            description='Format year-month-day, zero padded',
            required=True,
            default='2022-05-03'
        ),
        OpenApiParameter(
            name='pickUpTime',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Hour between 0-23',
            required=True,
            default=14
        )
     ]
)
#TEST
@api_view(["GET"])
def getLastAvailableDropOffTime(request, offer_id):
    response_data = {}
    pickUpLocationId = request.GET.get("pickUpLocationId")
    dropOffLocationId = request.GET.get("dropOffLocationId")
    pickUpDate = request.GET.get("pickUpDate")
    pickUpTime = request.GET.get("pickUpTime")
    #check if required fields are filled
    if (pickUpLocationId == None or dropOffLocationId == None or pickUpDate == None or pickUpTime == None):
        return Response({"error": "Required fields not filled"}, status=404)
    date_format = "%Y-%m-%d"
    pickUpDateTime = None
    #check pick up date and time
    if pickUpDate != None:
        try:
            pickUpDate = datetime.strptime(pickUpDate, date_format).date()
        except ValueError:
            return Response({"error": "Invalid date format"}, status=404)
        if pickUpTime  == None:
            return Response({"error": "Pick up time not specified"}, status=404)
        try:
            pickUpTime = int(pickUpTime)
        except:
            return Response({"error": "Invalid time format"}, status=404)
        if pickUpTime < 0 or pickUpTime > 23:
            return Response({"error": "Invalid time format"}, status=404)
        pickUpDateTime = datetime.combine(pickUpDate, datetime.min.time()) + timedelta(hours=pickUpTime)
    #check if locations exist
    try:
        pickUpLocation = Location.objects.get(pk=pickUpLocationId)
        dropOffLocation = Location.objects.get(pk=dropOffLocationId)
    except Location.DoesNotExist:
        return Response({"error": "Locations not found"}, status=404)
    offer = Offer.objects.get(pk=offer_id)
    vehicles = Vehicle.objects.filter(location=pickUpLocation).filter(dealer=offer.dealer).filter(model=offer.model)
    #check if vehicles are available
    active_rents = Rent.objects.filter(vehicle__in=vehicles).filter(dateTimeRented__lte=pickUpDateTime, dateTimeReturned__gte=pickUpDateTime)
    rented_vehicles = active_rents.values_list('vehicle', flat=True)
    vehicles = vehicles.exclude(vehicle_id__in=rented_vehicles)
    if vehicles.count() == 0:
        return Response({"error": "No vehicles available"}, status=404)
    #frontend will check if the drop off time is during working hours, we need to
    #get the last available drop off time for any available vehicle (for each vehicle we will get the last rent that starts after the pick up time, or none if it doesn't exist)
    vehicle_id = None
    lastReturnDateTime = None
    for vehicle in vehicles:
        rentals = Rent.objects.filter(vehicle=vehicle).filter(dateTimeRented__gt=pickUpDateTime)
        if rentals.count() == 0:
            lastReturnDateTime = None
            vehicle_id = vehicle.vehicle_id
            break
        vehicleReturnDateTime = rentals.order_by('dateTimeRented')[0].dateTimeRented
        vehicleReturnDateTime = getFirstAvailableWorkingTime(vehicleReturnDateTime, dropOffLocation)
        if vehicleReturnDateTime == False:
            return Response({"error": "No working hours for drop off location"}, status=404)
        if lastReturnDateTime == None or vehicleReturnDateTime > lastReturnDateTime:
            lastReturnDateTime = vehicleReturnDateTime
            vehicle_id = vehicle.vehicle_id

    #we also need to return the working hours of the drop off location
    workingHours = WorkingHours.objects.filter(location=dropOffLocation)
    workingHoursArray = []
    for workingHour in workingHours:
        workingHoursArray.append({
            "dayOfTheWeek" : workingHour.dayOfTheWeek,
            "startTime" : workingHour.startTime,
            "endTime" : workingHour.endTime
        })

    response_data = {
        "lastReturnDateTime" : lastReturnDateTime, # if none, the vehicle has no upcoming rents and can be returned at any time
        "vehicle_id" : vehicle_id, 
        "workingHours" : workingHoursArray
    }
    return JsonResponse(response_data, status=200)



#we have found the first upcoming rental time for a vehicle, now we need to find the actual return time
#which will be the the first working time of the drop off location before or at the same time as returnDateTime
def getFirstAvailableWorkingTime(returnDateTime, dropOffLocation):
    dropOffWorkingHours = WorkingHours.objects.filter(location=dropOffLocation)
    if dropOffWorkingHours.count() == 0:
        return False
    workingHours = dropOffWorkingHours.filter(dayOfTheWeek=returnDateTime.weekday())
    wrongDay = False
    #if the location is closed on the specified day, we will get the last working day before returnDateTime
    while workingHours.count() == 0:
        wrongDay = True
        returnDateTime -= timedelta(days=1)
        workingHours = dropOffWorkingHours.filter(dayOfTheWeek=returnDateTime.weekday())
    #if we picked a closed day we will get the end time of the last working day
    if wrongDay:
        returnDateTime = returnDateTime.replace(hour=workingHours[0].endTime.hour, minute=0, second=0)
    else:
        # if we got a working day we have 3 possibilities
        # 1. returnDateTime is after closing time and we have to return it at the endtime of the current day
        # 2. returnDateTime is before opening time and we have to return it at the endtime of the last working day
        # 3. returnDateTime is during working hours and we can return it normally
        if returnDateTime.hour > workingHours[0].endTime:
            returnDateTime = returnDateTime.replace(hour=workingHours[0].endTime.hour, minute=0, second=0)
        elif returnDateTime.hour < workingHours[0].startTime:
            returnDateTime -= timedelta(days=1)
            #find first previous working day
            while workingHours.count() == 0:
                returnDateTime -= timedelta(days=1)
                workingHours = dropOffWorkingHours.filter(dayOfTheWeek=returnDateTime.weekday())
            returnDateTime = returnDateTime.replace(hour=workingHours[0].endTime.hour, minute=0, second=0)

    return returnDateTime

#FOR IVAN'S PROFILE VIEWS
@api_view(["POST"])
def postReview(request, rent_id):
    try:
        rent = Rent.objects.get(pk=rent_id)
        user = request.user
        if (not user.is_authenticated or not canUserReview(user, rent)):
            return Response({"error": "User can't review"}, status=404)
        rentoid = Rentoid.objects.get(user=user)
        if Review.objects.filter(rent=rent).exists():
            return Response({"error": "Review already exists"}, status=404)
        rating = request.POST.get("rating")
        description = request.POST.get("description")
        if rating == None:
            return Response({"error": "Rating not specified"}, status=404)
        try:
            rating = int(rating)
        except:
            return Response({"error": "Invalid rating format"}, status=404)
        if rating < 1 or rating > 5:
            return Response({"error": "Invalid rating format"}, status=404)
        review = Review(rent=rent, rating=rating, description=description, reviewDate=datetime.now())
        review.save()
        offer = Offer.objects.get(model=rent.vehicle.model, dealer=rent.vehicle.dealer)
        calculateReviewsForOffer(offer)
        vehicle = Vehicle.objects.get(pk=rent.vehicle.vehicle_id)
        calculateReviewsForVehicle(vehicle)
        return Response({"message": "Review added"}, status=200)
    except Rent.DoesNotExist:
        return Response({"error": "Rent not found"}, status=404)

#Some helpful functons, calculate and update noOfReviews and rating for offers and vehicles
def calculateReviewsForOffer(offer):
    rentals = Rent.objects.filter(vehicle__dealer=offer.dealer).filter(vehicle__model=offer.model).values('rent_id')
    reviews = Review.objects.filter(rent__in=rentals).all()
    rating = 0
    for review in reviews:
        rating += review.rating
    offer.rating = rating / reviews.count()
    offer.noOfReviews = reviews.count()
    offer.save()

def calculateReviewsForVehicle(vehicle):
    rentals = Rent.objects.filter(vehicle=vehicle).values('rent_id')
    reviews = Review.objects.filter(rent__in=rentals).all()
    rating = 0
    for review in reviews:
        rating += review.rating
    vehicle.rating = rating / reviews.count()
    vehicle.noOfReviews = reviews.count()
    vehicle.save()
#FOR IVAN'S PROFILE VIEWS

#these two will be called only when we fill the database with mock data
def calculateReviewsForAllOffers():
    offers = Offer.objects.all()
    for offer in offers:
        calculateReviewsForOffer(offer)

def calculateReviewsForAllVehicles():
    vehicles = Vehicle.objects.all()
    for vehicle in vehicles:
        calculateReviewsForVehicle(vehicle)