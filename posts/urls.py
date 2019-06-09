from django.urls import path

from . import views


urlpatterns = [
    path('', views.index),
    path('api/posts/', views.PostListCreateView.as_view(), name='post_list_create'),
    path('api/posts/<int:pk>/', views.PostDetailEditDelete.as_view(), name='post_detail_edit_delete')
]
