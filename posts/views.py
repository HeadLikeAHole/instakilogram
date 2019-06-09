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

    # add user object contained in request to post instance when creating it
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostDetailEditDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    # permission_classes = [IsOwnerOrReadOnly]

