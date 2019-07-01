from rest_framework import serializers

from .models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.CharField(source='user.profile.image.url', read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['user', 'likes']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'replies', 'likes']
