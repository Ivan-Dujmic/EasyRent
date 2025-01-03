from django.db import models
# for defining choices (type of fuel)
from django.utils.translation import gettext_lazy as _
from src.models import *


# for mapping the ModelType DB table
class ModelType(models.Model):
    class modelName(models.TextChoices):
        SUV = 'Suv', _('Suv')
        LIMO = 'Limo', _('Limo')
        COMPACT = 'Compact', _('Compact')
    modelType_id = models.AutoField(primary_key=True)
    modelTypeName = models.CharField(max_length=7, choices=modelName.choices)
    def __str__(self):
        return self.modelTypeName

# for mapping the model DB table
class Model(models.Model):
    class typeOfFuel(models.TextChoices):
        GAS = 'G', _('Gas')
        DIESEL = 'D', _('Diesel')
        ELECTRIC = 'E', _('Electric')
    model_id = models.AutoField(primary_key=True)
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
    offer_id = models.AutoField(primary_key=True)
    model = models.ForeignKey(Model, on_delete=models.CASCADE)
    dealer = models.ForeignKey(Dealership, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.FloatField(blank=True, default=None, null=True)
    noOfReviews = models.IntegerField(blank=True, default=0)
    description = models.TextField(blank=True, default='')
    image = models.BinaryField(default=b'')
    #unique
    class Meta:
        unique_together = ('model', 'dealer')
    def __str__(self):
        return "ModelID: " + self.model + " DealerID: " + self.dealer

# for mapping the Vehicle DB table
class Vehicle(models.Model):
    vehicle_id = models.AutoField(primary_key=True)
    registration = models.CharField(max_length=20, unique=True)
    model = models.ForeignKey(Model, on_delete=models.SET_NULL, null=True)
    dealer = models.ForeignKey(Dealership, on_delete=models.CASCADE)
    timesRented = models.IntegerField(blank=True, default=0)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, blank=True, default=None, null=True)
    isVisible = models.BooleanField(default=True)
    def __str__(self):
        return "Reg: " + self.registration + " DealerID: " + self.dealer
    
class Rent(models.Model):
    rent_id = models.AutoField(primary_key=True)
    rentoid = models.ForeignKey(Rentoid, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    dateTimeRented = models.DateTimeField()
    dateTimeReturned = models.DateTimeField(blank=True, default=None, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    rent = models.ForeignKey(Rent, on_delete=models.CASCADE)
    rating = models.SmallIntegerField(blank=True, default=None, null=True)
    description = models.TextField(blank=True, default='')
    reviewDate = models.DateField(blank=True, default=None, null=True)
"""
Zapisi u recenziji se dodaju u trenutku kada se definira dateTimeReturned 
i ostaju prazni dok ih rentoid ne ispuni što može biti u bilo kojem trenutku u budućnosti.
Samo se polje rating mora definirati kako bi se recenzija smatrala ispunjenom, dok ostala polja mogu ostati nedefinirana
Ako rentoid odbije napraviti recenziju (što je potrebno eksplicitno definirati ili pri isteku vremena) 
tek onda se prazni zapis miče iz tablice
Recenzije koje su jednom definirane ne mogu se promjeniti niti maknuti iz tablice, 
"""