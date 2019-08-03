from rest_framework import generics

from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer, ReplySerializer
from .permissions import IsOwnerOrReadOnly


# create post list and post create api view
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    # add user object contained in request to post instance when creating it
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostDetailEditDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [IsOwnerOrReadOnly]


# create comment list and comment create api view
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        # self.kwargs['pk'] extracts post id from url
        post_id = self.kwargs['pk']
        query_set = Comment.objects.filter(post=post_id, parent=None)
        return query_set

    # add user and post objects to comment instance when creating it
    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['pk'])
        serializer.save(user=self.request.user, post=post)


# create reply list and reply create api view
class ReplyListCreateView(generics.ListCreateAPIView):
    serializer_class = ReplySerializer

    def get_queryset(self):
        # self.kwargs['id'] extracts post id from url
        post_id = self.kwargs['pk']
        parent_id = self.kwargs['id']
        query_set = Comment.objects.filter(post=post_id, parent=parent_id)
        return query_set

    # add user, post and parent objects to comment instance when creating it
    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['pk'])
        parent = Comment.objects.get(pk=self.kwargs['id'])
        serializer.save(user=self.request.user, post=post, parent=parent)


# comment and reply edit and delete view
class CommentDetailEditDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
