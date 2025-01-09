from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views

app_name = "home"
urlpatterns = [
    path('offer/<int:offer_id>/', views.getOfferDetails, name='offerDetails'),
    path('showcased/', views.get_showcased, name='showcased'),
    path('locations/', views.getLocations, name='locations'),
    path('models/', views.getModels, name='models'),
    path('company/<int:dealership_id>/', views.getCompany, name='getCompany'),
    path('offers/<int:dealership_id>/', views.getOffersForCompany, name='getOffersForCompany'),
    path('showcased-companies/', views.getShowcasedCompanies, name='getShowcasedCompanies'),
    path('most-popular/', views.getMostPopularOffers, name='getMostPopularOffers'),
    path('best-value/', views.getBestValueOffers, name='getBestValueOffers'),
    path('cities/', views.getCities, name='getCities'),
    path('search/', views.getFilteredOffers, name='getFilteredOffers'),
    path('reviews/<int:offer_id>/', views.getReviews, name='getReviews'),
    path('offer-locations/<int:offer_id>/', views.getLocationsForOffer, name='getLocationsForOffer'),
]