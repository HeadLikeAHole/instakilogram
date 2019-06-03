from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import Profile


# create a profile when a new user registers
# should be registered in apps.py
# code is explained in django docs - signals
@receiver(post_save, sender=settings.AUTH_USER_MODEL)  # sender is custom user
def create_profile(sender, **kwargs):
    if kwargs['created']:
        Profile.objects.create(user=kwargs['instance'])
