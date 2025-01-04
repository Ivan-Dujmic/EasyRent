from django.db import models
from django.forms import ValidationError
from django.contrib.auth.models import AbstractUser, User


class Rentoid(models.Model):
    rentoid_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    phoneNo = models.CharField(max_length=20, null=True, blank=True)
    driversLicenseNo = models.CharField(max_length=16, default=None)
    balance = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00, blank=True
    )

    def __str__(self):
        return f"{self.firstName} {self.lastName}"


class Dealership(models.Model):
    dealership_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    phoneNo = models.CharField(max_length=20, null=True, blank=True)
    TIN = models.CharField(max_length=16, default=None)
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='logos')
    isAccepted = models.BooleanField(blank=True, null=True, default=None)

    def __str__(self):
        return self.TIN


class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    countryName = models.CharField(max_length=50, blank=True, default='')
    cityName = models.CharField(max_length=50, blank=True, default='')
    streetName = models.CharField(max_length=100)
    streetNo = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE)
    isHQ = models.BooleanField(default=False, blank=True)

    class Meta:
        unique_together = (
            ("countryName", "cityName", "streetName", "streetNo"),
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
        return f"{self.countryName} {self.cityName} {self.streetName} {self.streetNo}"


class WorkingHours(models.Model):
    workingHours_id = models.AutoField(primary_key=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True)
    dayOfTheWeek = models.IntegerField(
        choices=[
            (i, day)
            for i, day in enumerate(
                [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
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