from rest_framework import serializers

from .models import Post, Comment


class ReplySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.CharField(source='user.profile.image.url', read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'post', 'parent', 'likes']


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.CharField(source='user.profile.image.url', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'post', 'parent', 'likes']

    def get_replies(self, obj):
        if not obj.parent:
            return ReplySerializer(obj.replies.all(), many=True).data
        return None


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.CharField(source='user.profile.image.url', read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['user', 'likes']

    def get_comments(self, obj):
        query_set = Comment.objects.filter(post=obj, parent=None)
        comments = CommentSerializer(query_set, many=True).data
        return comments
