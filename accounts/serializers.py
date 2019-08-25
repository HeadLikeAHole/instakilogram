from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

from .models import Profile
from posts.serializers import PostSerializer


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


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    user_posts = serializers.SerializerMethodField()
    saved_posts = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    # return user's posts
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


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('image', 'info')


# profile's follower/following
class FollowerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'username', 'image')
