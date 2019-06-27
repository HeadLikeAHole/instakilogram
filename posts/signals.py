from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Post


# delete image file after deleting image object (it isn't done automatically by django)
# should be registered in apps.py
# instance.image – ensures that only the current file is affected
# Passing “false” to instance.image.delete ensures that FileField does not save the model
# Unlike pre_delete, post_delete signal is sent at the end of a model’s delete() method
# and a queryset’s delete() method.
# This is safer as it does not execute unless the parent object is successfully deleted.
@receiver(post_delete, sender=Post)
def delete_image_file(sender, **kwargs):
    kwargs['instance'].image.delete(False)
