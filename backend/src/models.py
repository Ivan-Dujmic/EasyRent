from django.db import models
from django.forms import ValidationError
from django.contrib.auth.models import AbstractUser, User


class Rentoid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    phoneNumber = models.CharField(max_length=20, default=None)
    driversLicenseNumber = models.CharField(max_length=16, default=None)
    balance = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00, blank=True
    )

    def __str__(self):
        return f"{self.firstName} {self.lastName}"


class Dealership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    phoneNumber = models.CharField(max_length=20, default=None)
    TIN = models.CharField(max_length=16, default=None)
    description = models.TextField(blank=True, default="")
    image = models.BinaryField(default=b'')
    isAccepted = models.BooleanField(blank=True, null=True, default=None)

    def __str__(self):
        return self.companyName


class Country(models.Model):
    countryName = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.countryName


class City(models.Model):
    cityName = models.CharField(max_length=50)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, default="1")

    class Meta:
        unique_together = ('cityName', 'country')

    def __str__(self):
        return f"{self.country} {self.cityName}"


class Location(models.Model):
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    streetName = models.CharField(max_length=100)
    streetNo = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE)
    isHQ = models.BooleanField(default=False, blank=True)

    class Meta:
        unique_together = (
            ("city", "streetName", "streetNo"),
            ("latitude", "longitude"),
        )
        constraints = [
            models.UniqueConstraint(
                fields=["dealership", "isHQ"],
                condition=models.Q(isHQ=True),
                name="unique_hq_per_dealership",
            )
        ]

    def __str__(self):
        return f"{self.city} {self.streetName} {self.streetNo}"


class WorkingHours(models.Model):
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    dayOfTheWeek = models.IntegerField(
        choices=[
            (i, day)
            for i, day in enumerate(
                [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ]
            )
        ]
    )
    startTime = models.TimeField()
    endTime = models.TimeField()

    class Meta:
        unique_together = ("location", "dayOfTheWeek")

    def clean(self):
        if self.startTime >= self.endTime:
            raise ValidationError("Start time must be before the end time.")

    def __str__(self):
        return (
            f"Working hours for {self.location} on {self.get_dayOfTheWeek_display()}"
        )
