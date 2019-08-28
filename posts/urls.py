from django.urls import path

from . import views


urlpatterns = [
    path('', views.PostListCreateView.as_view(), name='post_list_create'),
    path('<int:pk>/', views.PostDetailEditDeleteView.as_view(), name='post_detail_edit_delete'),
    path('<int:pk>/comments/', views.CommentListCreateView.as_view(), name='comment_list_create'),
    path('<int:pk>/comments/<int:id>/replies/', views.ReplyCreateView.as_view(), name='reply_create'),
    path('comment/<int:pk>/', views.CommentDetailEditDeleteView.as_view(), name='comment_detail_edit_delete'),
    path('<int:pk>/like/', views.PostLikeView.as_view(), name='post_like'),
    path('<int:pk>/like-list/', views.PostLikeListView.as_view(), name='post_like_list'),
    path('comment/<int:pk>/like/', views.CommentLikeView.as_view(), name='comment_like'),
    path('comment/<int:pk>/like-list/', views.CommentLikeListView.as_view(), name='comment_like_list'),
    path('post-slider/', views.PostSlider.as_view(), name='post-slider')
]
