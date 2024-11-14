from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Dealership

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