from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth.validators import UnicodeUsernameValidator

from .models import Profile
from posts.serializers import PostSerializer


# https://docs.djangoproject.com/en/2.2/topics/auth/customizing/#referencing-the-user-model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.CharField(source='profile.image.url', read_only=True)
    saved_posts = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile_image', 'saved_posts')
        extra_kwargs = {
            'username': {
                'validators': [UnicodeUsernameValidator()],
            }
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    # return user's saved posts
    def get_saved_posts(self, obj):
        # extract saved posts ids from queryset and send the list of ids instead of whole posts
        query_set = obj.profile.saved_posts.order_by('postsave')
        saved_posts_ids = []
        for post in query_set:
            saved_posts_ids.append(post.id)
        return saved_posts_ids


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    following = serializers.SerializerMethodField()
    user_posts = serializers.SerializerMethodField()
    saved_posts = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    # return list of users current user follows
    def get_following(self, obj):
        return obj.following.all()

    # return all user's posts
    def get_user_posts(self, obj):
        query_set = obj.user.post_set.all()
        # send request object to post serializer so current logged in user object can be accessed there
        # to check if post was liked by him
        # (transferred this feature to front end, on backend it doesn't work for some reason)
        request = self.context['request']
        return PostSerializer(query_set, many=True, context={'request': request}).data

    # return user's saved posts
    def get_saved_posts(self, obj):
        query_set = obj.saved_posts.order_by('postsave')
        return PostSerializer(query_set, many=True).data

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)
        instance.info = validated_data.get('info', instance.info)
        instance.user.username = validated_data.get('username', instance.user.username)
        # instance.user.email = validated_data.get('email', instance.user.email)
        instance.user.first_name = validated_data.get('first_name', instance.user.first_name)
        instance.user.last_name = validated_data.get('last_name', instance.user.last_name)
        instance.save()
        return instance


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
