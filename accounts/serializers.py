from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

from .models import Profile
from posts.serializers import PostSerializer


# https://docs.djangoproject.com/en/2.2/topics/auth/customizing/#referencing-the-user-model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.CharField(source='profile.image.url', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile_image')


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    following = serializers.SerializerMethodField()
    user_posts = serializers.SerializerMethodField()
    user_saved_posts = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    # return list of users current user follows
    def get_following(self, obj):
        return obj.following.all()

    # return all user's posts
    def get_user_posts(self, obj):
        query_set = obj.user.post_set.all()
        return PostSerializer(query_set, many=True).data

    # return all user's posts
    def get_user_saved_posts(self, obj):
        query_set = obj.saved_posts.all()
        return PostSerializer(query_set, many=True).data


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        # make password invisible while posting it
        extra_kwargs = {
            'password': {'write_only': True},
        }

    # create user using validated data
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Incorrect Credentials')
