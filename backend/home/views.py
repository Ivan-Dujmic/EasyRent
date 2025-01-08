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
from django.db.models import F, ExpressionWrapper, DecimalField, Q
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
        can_review = 1 if request.user.is_authenticated and user_can_review(request.user, offer) else 0

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
            "description": offer.description,
            "canReview": can_review
        }

        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offer not found"}, status=404)

def user_can_review(user, offer):
    # Implement your logic to determine if the user can review the offer
    return True  # Placeholder logic


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
            "longitude" : location.longitude
        })
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
            if not makeModel.__contains__(make.makeName):
                makeModel[make.makeName] = []
            makeModel[make.makeName].append({"modelName" : make.modelName, "model_id" : make.model_id})
        for makeName, modelList in makeModel.items():
            response_array.append({
                "makeName" : makeName,
                "models" : modelList 
            }
            )
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
            description='Hour between 0-24, but will only give results if it is during the working hours of the company',
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
            description='Hour between 0-24, but will only give results if it is during the working hours of the company',
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
            default='Tiguain'
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
        pick_up_locations = Location.objects.filter(cityName=pick_up_cityName, countryName=pick_up_countryName).values_list('dealership', flat=True)    
        pick_up_dealers = Dealership.objects.filter(dealership_id__in=pick_up_locations)
        #if drop off location exists, check if it is owned by the same dealer
        if drop_off_location != None:
            if not re.match("^[a-zA-Z ]+-[a-zA-Z ]+$", drop_off_location):
                return Response({"error": "Invalid location format"}, status=404)
            drop_off_cityName = drop_off_location.split("-")[0]
            drop_off_countryName = drop_off_location.split("-")[1]
            drop_off_locations = Location.objects.filter(cityName=drop_off_cityName, countryName=drop_off_countryName).values_list('dealership', flat=True)
            drop_off_dealers = Dealership.objects.filter(dealership_id__in=drop_off_locations).values_list('dealership_id', flat=True)
            pick_up_dealers = pick_up_dealers.filter(dealership_id__in=drop_off_dealers)
            if pick_up_dealers.count() == 0:
                return Response({"error": "Pick up and drop off locations are not owned by the same dealer"}, status=404)
        #get offers for specified location/dealers
        offers = Offer.objects.filter(dealer__in=pick_up_dealers)
        #filter by seats
        if seats != None:
            offers = offers.filter(model__noOfSeats=seats)
        #filter by car type
        if car_type != None:
            offers = offers.filter(model__modelType__modelTypeName=car_type)
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
        #check working hours and pick up and drop off times
       # working_hours_pick_up = (WorkingHours.objects.filter(location=pick_up_location)
       # .filter(dayOfTheWeek=pick_up_date.weekday()))
       # opening_time_pick_up = working_hours_pick_up.startTime.hour
       ## closing_time_pick_up = working_hours_pick_up.endTime.hour
       # if not (opening_time_pick_up <= pick_up_time <= closing_time_pick_up):
       #     return Response({"error": "Pick up time is not during working hours"}, status=404)
       # if drop_off_location:
       #     working_hours_drop_off = (WorkingHours.objects.filter(location=drop_off_location)
       #     .filter(dayOfTheWeek=drop_off_date.weekday()))
        #    opening_time_drop_off = working_hours_drop_off.startTime.hour
        #    closing_time_drop_off = working_hours_drop_off.endTime.hour
        #    if not (opening_time_drop_off <= drop_off_time <= closing_time_drop_off):
         #       return Response({"error": "Drop off time is not during working hours"}, status=404)
            
        #check if any vehicles are available for the specified time period, we will get all vehicles that
        #are parts of offers that are available for the specified time period, that are at the pick up location
        #and that are owned by the dealers that own the pick up and drop off locations
        model_id_list = offers.values_list('model', flat=True)
        vehicles = Vehicle.objects.filter(model__in=model_id_list)
        #we need to filter both by pick up locations and possible dealers. If we only filter by pick up locations
        #we might get vehicles that do not belong to one of the dealers that own the pick up and drop off locations
        #if we only filter by dealers, we might get vehicles that are not at the pick up location
        vehicles = vehicles.filter(location__in=pick_up_locations).filter(dealer__in=pick_up_dealers)
        pick_up_datetime = datetime.combine(pick_up_date, datetime.min.time()) + timedelta(hours=pick_up_time)
        drop_off_datetime = datetime.combine(drop_off_date, datetime.min.time()) + timedelta(hours=drop_off_time)
        active_rents = Rent.objects.filter(Q(dateTimeRented__lt=pick_up_datetime, dateTimeReturned__gt=pick_up_datetime) |
        Q(dateTimeRented__lt=drop_off_datetime, dateTimeReturned__gt=drop_off_datetime))
        rented_vehicles = active_rents.values_list('vehicle', flat=True)
        available_vehicles = vehicles.exclude(vehicle_id__in=rented_vehicles)
        #we will get all offers that are part of available vehicles
        offers_list = []
        for offer in offers:
            if available_vehicles.filter(model=offer.model).filter(dealer=offer.dealer).exists():
                offers_list.append(
                    {
                        #"image" : base64.b64encode(offer.image),
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
        offset = (page - 1) * limit
        response_data = {"offers" : offers_list[offset:offset+limit]}
        return JsonResponse(response_data, status=200)
    except Offer.DoesNotExist:
        return Response({"error": "Offers not found"}, status=404)
    