from django.db import models
from django.conf import settings
from django.template.defaultfilters import truncatechars
from PIL import Image


class Post(models.Model):
    # settings.AUTH_USER_MODEL is custom user model
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images')
    description = models.TextField(max_length=150)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='post_likes', blank=True)
    published = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published']

    def __str__(self):
        # truncate displayed description in admin site to 30 chars
        return truncatechars(self.description, 30)

    # crop uploaded image's resolution to 1080px
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # methods from PIL library
        img = Image.open(self.image.path)
        if img.height > 1080 or img.width > 1080:
            output_size = (1080, 1080)
            img.thumbnail(output_size)
            img.save(self.image.path)


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    text = models.TextField(max_length=500)
    # create relationship to parent comment making this comment a reply to it
    parent = models.ForeignKey('self', related_name='replies', on_delete=models.CASCADE, blank=True, null=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='comment_likes', blank=True)
    published = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        # truncate displayed text in admin site to 30 chars
        return truncatechars(self.text, 30)
