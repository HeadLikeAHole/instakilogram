from django.urls import path

from . import views


urlpatterns = [
    path('', views.PostListCreateView.as_view(), name='post_list_create'),
    path('<int:pk>/', views.PostDetailEditDelete.as_view(), name='post_detail_edit_delete')
]
