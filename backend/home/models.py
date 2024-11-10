from django.db import models
# for defining choices (type of fuel)
from django.utils.translation import gettext_lazy as _
from src.models import *


# for mapping the ModelType DB table
class ModelType(models.Model):
    modelTypeName = models.CharField(max_length=50)
    def __str__(self):
        return self.modelTypeName

# for mapping the model DB table
class Model(models.Model):
    class typeOfFuel(models.TextChoices):
        GAS = 'G', _('Gas')
        DIESEL = 'D', _('Diesel')
        ELECTRIC = 'E', _('Electric')
    noOfSeats = models.SmallIntegerField()
    automatic = models.BooleanField()
    fuelType = models.CharField(max_length=1, choices=typeOfFuel.choices)
    modelName = models.CharField(max_length=50)
    makeName = models.CharField(max_length=50)
    modelType = models.ForeignKey(ModelType, on_delete=models.SET_NULL, null=True)
    class Meta:
        unique_together = ('makeName', 'modelName')
    def __str__(self):
        return self.makeName + " " + self.modelName
   
# for mapping the offer DB table 
class Offer(models.Model):
    modelID = models.ForeignKey(Model, on_delete=models.CASCADE)
    dealerID = models.ForeignKey(Dealership, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.FloatField(blank=True, default=None, null=True)
    noOfReviews = models.IntegerField(blank=True, default=0)
    description = models.TextField(blank=True, default='')
    #path to offer image
    picture = models.CharField(max_length=50, blank=True, default='')
    #unique
    class Meta:
        unique_together = ('modelID', 'dealerID')
    def __str__(self):
        return "ModelID: " + self.modelID + " DealerID: " + self.dealerID
    
# for mapping the Vehicle DB table
class Vehicle(models.Model):
    registration = models.CharField(max_length=20, unique=True)
    modelID = models.ForeignKey(Model, on_delete=models.SET_NULL, null=True)
    dealerID = models.ForeignKey(Dealership, on_delete=models.CASCADE)
    insured = models.BooleanField(blank=True, default=None, null=True)
    yearOfCreation = models.IntegerField(blank=True, default=None, null=True)
    timesRented = models.IntegerField(blank=True, default=0)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, blank=True, default=None, null=True)
    def __str__(self):
        return "Reg: " + self.registration + " DealerID: " + self.dealerID
