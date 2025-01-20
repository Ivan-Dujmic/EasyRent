from django.db import models
from django.contrib.auth.models import AbstractUser, User

from home.models import Rentoid


class Wallet(models.Model):
    wallet_id = models.AutoField(primary_key=True)
    rentoid = models.ForeignKey(Rentoid, on_delete=models.CASCADE, default=None)
    gems = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.rentoid} {self.gems}"


class Transactions(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=20, null=True, blank=True)
