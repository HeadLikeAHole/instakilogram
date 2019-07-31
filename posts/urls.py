from django.urls import path

from . import views


urlpatterns = [
    path('', views.PostListCreateView.as_view(), name='post_list_create'),
    path('<int:pk>/', views.PostDetailEditDelete.as_view(), name='post_detail_edit_delete'),
    path('<int:pk>/comments/', views.CommentListCreateView.as_view(), name='comment_list_create'),
    path('<int:pk>/comments/<int:id>/replies/', views.ReplyListCreateView.as_view(), name='comment_list_create'),
    # path('comments/<int:pk>/', views.CommentDetailEditDelete.as_view(), name='post_detail_edit_delete'),
]
