from django.core.paginator import Paginator
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Post, Comment


User = get_user_model()


class ReplySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.CharField(source='user.profile.image.url', read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'post', 'parent', 'likes']

    def get_likes_count(self, obj):
        return obj.likes.count()


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.CharField(source='user.profile.image.url', read_only=True)
    replies = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'post', 'parent', 'likes']

    # paginated replies
    def get_replies(self, obj):
        if not obj.parent:
            reply_list = obj.replies.all()
            paginator = Paginator(reply_list, 5)
            page = self.context['request'].query_params.get('page') or 1
            replies = paginator.get_page(page)
            return ReplySerializer(replies, many=True).data
        return None

    def get_replies_count(self, obj):
        return obj.replies.count()

    def get_likes_count(self, obj):
        return obj.likes.count()


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.CharField(source='user.profile.image.url', read_only=True)
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['user', 'likes']

    def get_comments_count(self, obj):
        return obj.comment_set.count()

    def get_likes_count(self, obj):
        return obj.likes.count()


# post/comment liker
class LikerSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source='profile.image.url', read_only=True)
    followers = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'image', 'followers')

    def get_followers(self, obj):
        # extract ids of profiles from queryset and serialize the list of ids instead of whole profile objects
        query_set = obj.profile.followers.all()
        profile_ids = []
        for profile in query_set:
            profile_ids.append(profile.id)
        return profile_ids
