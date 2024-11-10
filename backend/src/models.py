from django.db import models
from django.forms import ValidationError
    
class AppUser(models.Model):
    email = models.CharField(max_length=254, unique=True)
    UID = models.CharField(max_length=16)
    phoneNumber = models.CharField(max_length=20, null=True, blank=True)
    passwordHash = models.CharField(max_length=255)
    isActivated = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.email


class RegistrationRequest(models.Model):
    appUserID = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    generationTimestamp = models.DateTimeField(auto_now_add=True)
    isComplete = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return f"{self.appUserID} {self.token}"


class Rentoid(models.Model):
    appUserID = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    balance = models.DecimalField(decimal_places=2, default=0.00, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    

class Dealership(models.Model):
    appUserID = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=50)
    description = models.TextField(blank=True, default="")

    def __str__(self):
        return self.companyName
    

class City(models.Model):
    cityName = models.CharField(max_length=30)

    def __str__(self):
        return self.cityName


class Location(models.Model):
    cityID = models.ForeignKey(City)
    streetName = models.CharField(max_length=100)
    streetNo = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    dealershipID = models.ForeignKey(Dealership, on_delete=models.CASCADE)
    isHQ = models.BooleanField(default=False, blank=True)

    class Meta:
        unique_together = (
            ('cityID', 'streetName', 'streetNo'),
            ('latitude', 'longitude')
        )
        constraints = [
            models.UniqueConstraint(fields=['dealershipID', 'isHQ'], condition=models.Q(isHQ=True), name='unique_hq_per_dealership')
        ]

    def __str__(self):
        return f"{self.cityID} {self.streetName} {self.streetNo}"
    

class WorkingHours(models.Model):
    locationID = models.ForeignKey(Location)
    dayOfTheWeek = models.IntegerField(choices=[(i, day) for i, day in enumerate(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])])
    startTime = models.TimeField()
    endTime = models.TimeField()

    class Meta:
        unique_together = ('locationID', 'dayOfTheWeek')

    def clean(self):
        if self.startTime >= self.endTime:
            raise ValidationError("Start time must be before the end time.")
        
    def __str__(self):
        return f"Working hours for {self.locationID} on {self.get_dayOfTheWeek_display()}"
