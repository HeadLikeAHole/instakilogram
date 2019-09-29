from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created

from .models import Profile


# create a profile when a new user registers
# should be registered in apps.py
# code is explained in django docs - signals
@receiver(post_save, sender=settings.AUTH_USER_MODEL)  # sender is custom user
def create_profile(sender, **kwargs):
    if kwargs['created']:
        Profile.objects.create(user=kwargs['instance'])


# delete image file after deleting image object (it isn't done automatically by django)
# should be registered in apps.py
# instance.image ensures that only the current file is affected
# Passing "False" to instance.image.delete ensures that ImageField does not save the model
# Unlike pre_delete, post_delete signal is sent at the end of a model’s delete() method
# and a queryset’s delete() method.
# This is safer as it does not execute unless the parent object is successfully deleted.
@receiver(post_delete, sender=Profile)
def delete_image_file_on_delete(sender, **kwargs):
    kwargs['instance'].image.delete(False)


@receiver(pre_save, sender=Profile)
def delete_image_file_on_update(sender, instance, **kwargs):
    """
    Deletes old image when updating model instance
    """
    try:
        old_image = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return False

    # if old image is the default profile image then it shouldn't be deleted otherwise delete old image
    if not old_image.url.endswith('/media/profile_default.png'):
        sender.objects.get(pk=instance.pk).image.delete(False)

    # if old and new images are default profile images
    # then make new image be equal to old image so new copy of the default profile image isn't created
    new_image = instance.image
    if old_image == new_image:
        instance.image = old_image


# https://github.com/anx-ckreuzberger/django-rest-passwordreset
@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        # url of password reset page
        'reset_password_url': "/#/password-reset/{}/".format(reset_password_token.key)
    }

    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        "Восстановление пароля на сайте {title}".format(title="Instakilogram"),
        # message:
        email_plaintext_message,
        # from:
        "djangoprojectemailsender@gmail.com",
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
