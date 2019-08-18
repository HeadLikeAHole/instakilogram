from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from django.contrib.auth import get_user_model

from .serializers import UserSerializer, UserUpdateSerializer, ProfileSerializer, ProfileUpdateSerializer, RegisterSerializer, LoginSerializer
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
