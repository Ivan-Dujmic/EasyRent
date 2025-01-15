from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Dealership

# When the dealership confirms it's email (user.is_active becomes true), 
# change dealership.isAccepted from None to False
# Then the admin has to manually change it to True
@receiver(post_save, sender=User)
def update_isAccepted(sender, instance, **kwargs):
    if instance.is_active and kwargs.get('created', False) is False:
        try:
            dealership = Dealership.objects.get(user=instance)
            if dealership.isAccepted is None: 
                dealership.isAccepted = False 
                dealership.save()
        except Dealership.DoesNotExist:
            pass