from typing import Any
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    username = None
    email = models.EmailField(max_length=25, primary_key=True)
    phoneNumber = models.CharField(max_length=15, blank=True, default='')
    UID = models.CharField(max_length=15, unique=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"

