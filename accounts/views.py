from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import pagination
from knox.models import AuthToken
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    UserUpdateSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    LoginSerializer,
    FollowerSerializer
)
from .models import Profile
from posts.models import Post
from posts.permissions import IsOwnerOrReadOnly


User = get_user_model()


class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserUpdateSerializer
    queryset = User.objects.all()


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsOwnerOrReadOnly]


class ProfileUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileUpdateSerializer
    queryset = Profile.objects.all()


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        # get_serializer returns a serializer instance
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            # get_serializer_context() returns a dictionary containing any extra context
            # that should be supplied to the serializer
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            # return a token to login user immediately after registering
            # AuthToken.objects.create returns a tuple(instance, token). So in order to get token use the index 1
            'token': AuthToken.objects.create(user)[1]
        })


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        # get_serializer returns a serializer instance
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            # get_serializer_context() returns a dictionary containing any extra context
            # that should be supplied to the serializer
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            # AuthToken.objects.create returns a tuple(instance, token). So in order to get token use the index 1
            'token': AuthToken.objects.create(user)[1]
        })


class PostSaveView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get(self, request, *args, **kwargs):
        post = Post.objects.get(pk=self.kwargs['id'])
        profile = Profile.objects.get(user=request.user)

        if post in profile.saved_posts.all():
            profile.saved_posts.remove(post)
        else:
            profile.saved_posts.add(post)
        return self.retrieve(request, *args, **kwargs)


class FollowerListPagination(pagination.PageNumberPagination):
    page_size = 10

    def get_paginated_response(self, data):
        context = {
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'users': data
        }
        return Response(context)


class FollowView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        # get current logged in user's profile
        user = User.objects.get(pk=self.kwargs['pk']).profile
        # get profile to follow
        profile = Profile.objects.get(pk=self.kwargs['id'])

        if user in profile.followers.all():
            profile.followers.remove(user)
        else:
            profile.followers.add(user)
        return self.retrieve(request, *args, **kwargs)


class FollowersView(generics.ListAPIView):
    serializer_class = FollowerSerializer
    pagination_class = FollowerListPagination

    def get_queryset(self):
        profile = Profile.objects.get(pk=self.kwargs['pk'])
        return profile.followers.order_by('-from_profile__id')


class FollowingView(generics.ListAPIView):
    # the same serializer class is used here as in FollowersView
    serializer_class = FollowerSerializer
    pagination_class = FollowerListPagination

    def get_queryset(self):
        profile = Profile.objects.get(pk=self.kwargs['pk'])
        # "-to_profile__id" is a field on the through model ProfileFollow
        return profile.following.order_by('-to_profile__id')
