from rest_framework import generics
from rest_framework import pagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer, ReplySerializer
from .permissions import IsOwnerOrReadOnly


class PostListPagination(pagination.PageNumberPagination):
    page_size = 2

    # change default "results" key to "posts" key for convenience
    def get_paginated_response(self, data):
        context = {
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'posts': data
        }
        return Response(context)


# create post list and post create api view
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = PostListPagination

    # add user object contained in request to post instance when creating it
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostDetailEditDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [IsOwnerOrReadOnly]


class CommentListPagination(pagination.PageNumberPagination):
    page_size = 10

    # change default "results" key to "comments" key for convenience
    def get_paginated_response(self, data):
        context = {
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'comments': data
        }
        return Response(context)


# create comment list and comment create api view
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentListPagination

    def get_queryset(self):
        # self.kwargs['pk'] extracts post id from url
        post_id = self.kwargs['pk']
        # filter out replies
        query_set = Comment.objects.filter(post=post_id, parent=None)
        return query_set

    # add user and post objects to comment instance when creating it
    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['pk'])
        serializer.save(user=self.request.user, post=post)


# create reply api view
class ReplyCreateView(generics.CreateAPIView):
    serializer_class = ReplySerializer

    # add user, post and parent objects to comment instance when creating it
    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['pk'])
        parent = Comment.objects.get(pk=self.kwargs['id'])
        serializer.save(user=self.request.user, post=post, parent=parent)


# comment and reply edit and delete view
class CommentDetailEditDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = [IsOwnerOrReadOnly]


class PostLikeView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        post = Post.objects.get(pk=self.kwargs['pk'])
        user = self.request.user

        if user in post.likes.all():
            post.likes.remove(user)
        else:
            post.likes.add(user)
        return self.retrieve(request, *args, **kwargs)


class CommentLikeView(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get(self, request, *args, **kwargs):
        comment = Comment.objects.get(pk=self.kwargs['pk'])
        user = self.request.user

        if user in comment.likes.all():
            comment.likes.remove(user)
        else:
            comment.likes.add(user)
        return self.retrieve(request, *args, **kwargs)
