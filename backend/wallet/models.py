from django.db import models
from django.contrib.auth.models import AbstractUser, User

from home.models import Rentoid


class Wallet(models.Model):
    wallet_id = models.AutoField(primary_key=True)
    rentoid = models.ForeignKey(Rentoid, on_delete=models.CASCADE, default=None)
    gems = models.DecimalField(
        max_digits=20, decimal_places=2, default=0.00, blank=True
    )

    def __str__(self):
        return f"{self.rentoid} {self.gems}"
