from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.conf import settings

from .models import Profile


# https://docs.djangoproject.com/en/2.2/topics/auth/customizing/#referencing-the-user-modelUser = get_user_model()
User = get_user_model()


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


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.CharField(source='profile.image.url', read_only=True)
    saved_posts = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile_image', 'saved_posts', 'following')
        read_only_fields = ('profile_image', 'saved_posts', 'following')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    # return user's saved posts
    def get_saved_posts(self, obj):
        # extract saved posts ids from queryset and serialize the list of ids instead of whole post objects
        query_set = obj.profile.saved_posts.order_by('postsave')
        saved_posts_ids = []
        for post in query_set:
            saved_posts_ids.append(post.id)
        return saved_posts_ids

    def get_following(self, obj):
        # extract ids of profiles from queryset and serialize the list of ids instead of whole profile objects
        query_set = obj.profile.following.all()
        profile_ids = []
        for profile in query_set:
            profile_ids.append(profile.id)
        return profile_ids


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    user_posts_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('id', 'user', 'image', 'info', 'followers_count', 'following_count', 'user_posts_count')
        read_only_fields = ('user', 'followers_count', 'following_count', 'user_posts_count')

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_user_posts_count(self, obj):
        return obj.user.post_set.count()

    def update(self, instance, validated_data):
        # if user deletes profile image then image isn't sent in api request and default profile image is set
        instance.image = validated_data.get('image', 'profile_default.png')
        instance.info = validated_data.get('info', instance.info)
        instance.save()
        return instance


# profile's follower/following
class FollowerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'username', 'image')


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        errors = dict()
        try:
            validate_password(value)
            return value

        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return value
