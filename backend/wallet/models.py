from django.db import models
from django.contrib.auth.models import AbstractUser, User


class Wallet(models.Model):
    wallet_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    gems = models.DecimalField(
        max_digits=20, decimal_places=2, default=0.00, blank=True
    )

    def __str__(self):
        return f"{self.user} {self.gems}"
