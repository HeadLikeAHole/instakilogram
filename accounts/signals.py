from django.db.models.signals import post_save
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
