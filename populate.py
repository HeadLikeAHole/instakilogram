# run "python populate.py" in terminal to use this script

import os
import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instakilogram.settings')
django.setup()


from django.contrib.auth import get_user_model
from accounts.models import Profile
from posts.models import Post


User = get_user_model()


# def create_users(n):
#     for i in range(n):
#         username = f'user_{i}'
#         email = f'user_{i}@email.com'
#         password = 'qazwsx123321'
#         User.objects.create_user(username, email, password)
#
#
# create_users(100)
#
# print('Users created!')
#
#
# def create_following(m, n):
#     for i in range(m, n + 1):
#         profile = Profile.objects.get(id=1)
#         following = Profile.objects.get(id=i)
#         profile.following.add(following)
#
#
# create_following(40, 70)
# print('Following added!')


def create_likes(m, n):
    for i in range(m, n + 1):
        post = Post.objects.get(id=69)
        like = User.objects.get(id=i)
        post.likes.add(like)


create_likes(1, 100)
print('Likes added!')
