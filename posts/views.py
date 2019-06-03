from django.shortcuts import render
from rest_framework import generics

from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from .permissions import IsOwnerOrReadOnly


# render index.html (whole website)
def index(request):
    return render(request, 'posts/index.html')


# create post list and post create api view
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()


class PostDetailEditDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [IsOwnerOrReadOnly]

