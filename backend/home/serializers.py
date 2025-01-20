from rest_framework import serializers
from .models import *
from home.models import *
import base64


#Serializer only used for example response in SwaggerUI
class OfferDetailsSerializer(serializers.Serializer):
    image = serializers.CharField(default="base64")
    makeName = serializers.CharField()
    modelName = serializers.CharField()
    companyName = serializers.CharField()
    dealership_id = serializers.IntegerField()
    noOfSeats = serializers.IntegerField()
    modelType = serializers.CharField()
    automatic = serializers.BooleanField()
    price = serializers.FloatField(default=0.1)
    rating = serializers.FloatField(default=0.1)
    noOfReviews = serializers.IntegerField()
    companyLogo = serializers.CharField(default="base64")
    description = serializers.CharField()

#for api/home/locations/
class LocationSerializer(serializers.Serializer):
    companyName = serializers.CharField()
    dealership_id = serializers.IntegerField()
    streetName = serializers.CharField()
    streetNo = serializers.CharField()
    cityName = serializers.CharField()
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    location_id = serializers.IntegerField()

class LocationListSerializer(serializers.Serializer):
    locations = serializers.ListField(child = LocationSerializer())

#for api/home/models
class ModelSerializer(serializers.Serializer):
    modelName = serializers.CharField()
    model_id = serializers.IntegerField()


class MakeModelSerializer(serializers.Serializer):
    makeName = serializers.CharField()
    models = serializers.ListField(child = ModelSerializer())

class MakeModelListSerializer(serializers.Serializer):
    makes = serializers.ListField(child = MakeModelSerializer())


#for api/home/company/:dealership_id
class DealershipLocationSerializer(serializers.Serializer):
    streetName = serializers.CharField()
    streetNo = serializers.CharField()
    cityName = serializers.CharField()
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    isHQ = serializers.BooleanField()

class DealershipSerializer(serializers.Serializer):
    companyLogo = serializers.CharField(default = "base64")
    companyName = serializers.CharField()
    dealership_id = serializers.IntegerField()
    description = serializers.CharField()
    locations = serializers.ListField(child = DealershipLocationSerializer())

#for api/home/offer/:dealership_id
class OfferSerializer(serializers.Serializer):
    image = serializers.CharField(default="base64")
    makeName = serializers.CharField()
    modelName = serializers.CharField()
    noOfSeats = serializers.IntegerField()
    automatic = serializers.BooleanField()
    price = serializers.FloatField(default=0.1)
    rating = serializers.FloatField(default=0.1)
    noOfReviews = serializers.IntegerField()
    offer_id = serializers.IntegerField()

class OfferListSerializer(serializers.Serializer):
    offers = serializers.ListField(child = OfferSerializer())
    last = serializers.BooleanField()

#for GET api/home/showcased-companies
class ShowcasedCompanySerializer(serializers.Serializer):
    companyName = serializers.CharField()
    companyLogo = serializers.FileField()
    dealership_id = serializers.IntegerField()

class ShowcasedCompanyListSerializer(serializers.Serializer):
    companies = serializers.ListField(child = ShowcasedCompanySerializer())


#for GET api/home/most-popular and other endpoints where an offer list is returned
class SearchedOffersSerializer(serializers.Serializer):
    image = serializers.CharField(default="base64")
    companyName = serializers.CharField()
    makeName = serializers.CharField()
    modelName = serializers.CharField()
    noOfSeats = serializers.IntegerField()
    automatic = serializers.BooleanField()
    price = serializers.FloatField(default=0.1)
    rating = serializers.FloatField(default=0.1)
    noOfReviews = serializers.IntegerField()
    offer_id = serializers.IntegerField()
    last = serializers.BooleanField()

class SearchedOffersListSerializer(serializers.Serializer):
    offers = serializers.ListField(child = SearchedOffersSerializer())
    last = serializers.BooleanField()

#for GET api/home/cities
class CitySerializer(serializers.Serializer):
    cityName = serializers.CharField()

class CountrySerializer(serializers.Serializer):
    countryName = serializers.CharField()
    cities = serializers.ListField(child = CitySerializer())

class CountryListSerializer(serializers.Serializer):
    countries = serializers.ListField(child = CountrySerializer())

# for GET api/home/reviews/:offer_id

class ReviewSerializer(serializers.Serializer):
    rating = serializers.FloatField()
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    reviewDate = serializers.DateField()
    description = serializers.CharField()

class ReviewListSerializer(serializers.Serializer):
    reviews = serializers.ListField(child = ReviewSerializer())
    last = serializers.BooleanField()

#for GET api/home/offer-locations/:offer_id
class AvailableLocationSerializer(serializers.Serializer):
    streetName = serializers.CharField()
    streetNo = serializers.CharField()
    cityName = serializers.CharField()
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    isHQ = serializers.BooleanField()
    location_id = serializers.IntegerField()

class AvailableLocationListSerializer(serializers.Serializer):
    locations = serializers.ListField(child = AvailableLocationSerializer())

# for GET api/home/unavailable-pick-up/:offer_id

class TimeIntervalSerializer(serializers.Serializer):
    dateTimeRented = serializers.DateTimeField()
    dateTimeReturned = serializers.DateTimeField()

class WorkingHoursSerializer(serializers.Serializer):
    dayOfTheWeek = serializers.IntegerField()
    openTime = serializers.IntegerField()
    closeTime = serializers.IntegerField()

class UnavailablePickupSerializer(serializers.Serializer):
    intervals = serializers.ListField(child = TimeIntervalSerializer())
    workingHours = serializers.ListField(child = WorkingHoursSerializer())


# GET for api/home/available-drop-off

class AvailableDropOffSerializer(serializers.Serializer):
    returnDate = serializers.DateField()
    returnTime = serializers.IntegerField()
    vehicle_id = serializers.IntegerField()
    workingHours = serializers.ListField(child = WorkingHoursSerializer())

class DealershipLogoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    companyName = serializers.CharField(source='user.first_name')
    class Meta:
        model = Dealership
        fields = ['companyName', 'image']

    def get_image(self, obj):
        if obj.image:
            return base64.b64encode(obj.image).decode('utf-8')


class OfferCardSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    companyName = serializers.CharField(source='dealer.user.first_name')
    modelName = serializers.CharField(source='model.modelName')
    makeName = serializers.CharField(source='model.makeName')
    noOfSeats = serializers.IntegerField(source='model.noOfSeats')
    automatic = serializers.BooleanField(source='model.automatic')

    class Meta:
        model = Offer
        fields = ['image', 'companyName', 'modelName', 'makeName', 'noOfSeats', 'automatic', 'price', 'rating', 'noOfReviews']

    def get_image(self, obj):
        if obj.image:
            return base64.b64encode(obj.image).decode('utf-8')