# run "python populate.py" in terminal to use this script

import os
import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instakilogram.settings')
django.setup()


from django.contrib.auth import get_user_model
from accounts.models import Profile
from posts.models import Post, Comment


User = get_user_model()


def create_users(n):
    for i in range(1, n + 1):
        username = f'user_{i}'
        email = f'user_{i}@email.com'
        password = 'qazwsx123321'
        User.objects.create_user(username, email, password)


create_users(99)

print('Users created!')


def create_following(m, n):
    for i in range(m, n + 1):
        profile = Profile.objects.get(id=1)
        following = Profile.objects.get(id=i)
        profile.following.add(following)


create_following(30, 50)
print('Following added!')


def create_post_likes(m, n):
    for i in range(m, n + 1):
        post = Post.objects.get(id=1)
        like = User.objects.get(id=i)
        post.likes.add(like)


create_post_likes(1, 100)
print('Post likes added!')


def create_comment_likes(m, n):
    for i in range(m, n + 1):
        comment = Comment.objects.get(id=1)
        like = User.objects.get(id=i)
        comment.likes.add(like)


create_comment_likes(1, 100)
print('Comment likes added!')
