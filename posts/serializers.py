from rest_framework import serializers

from .models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['user', 'likes']

    # get full url to profile image
    def get_profile_image(self, obj):
        request = self.context.get('request')
        profile_image = obj.user.profile.image.url
        return request.build_absolute_uri(profile_image)


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'replies', 'likes']
