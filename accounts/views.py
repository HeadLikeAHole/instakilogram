from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken

from .serializers import UserSerializer, RegisterSerializer, LoginSerializer


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


class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
