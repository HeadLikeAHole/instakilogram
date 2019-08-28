from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from PIL import Image

from posts.models import Post


# override default user model to make email a unique and required field
# AUTH_USER_MODEL setting pointing to this model should be added to setting.py file
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)


# user's profile
class Profile(models.Model):
    # settings.AUTH_USER_MODEL is custom user model
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(default='profile_default.png', upload_to='profile_images')
    info = models.TextField(max_length=300, blank=True)
    followers = models.ManyToManyField(
        'self', symmetrical=False, related_name='following', through='ProfileFollow', blank=True
    )
    saved_posts = models.ManyToManyField(Post, related_name='saved_by', through='PostSave', blank=True)

    def __str__(self):
        return f'{self.user.username}\'s profile'

    # crop uploaded profile image's resolution to 360px
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # methods from PIL library
        img = Image.open(self.image.path)
        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.image.path)


# this model is created for ordering of m2m relationship (Profile.objects.order_by('postsave'))
# without it saved posts are ordered randomly
class PostSave(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)


# the same as above
# fields from_profile and to_profile create a through model with relationship to itself
# with just one field an error is thrown
class ProfileFollow(models.Model):
    from_profile = models.ForeignKey(Profile, related_name='to_profile', on_delete=models.CASCADE)
    to_profile = models.ForeignKey(Profile, related_name='from_profile', on_delete=models.CASCADE)
