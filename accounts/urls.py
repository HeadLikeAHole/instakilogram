from django.urls import path
from knox import views as knox_views

from . import views


urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    # knox view
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('user/change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('user/<int:pk>/follow/<int:id>/', views.FollowView.as_view(), name='follow'),
    path('profile/<int:pk>/', views.ProfileView.as_view(), name='profile'),
    # without profile pk in url PostSave view can't find and send necessary profile object in response
    path('profile/<int:pk>/post-save/<int:id>/', views.PostSaveView.as_view(), name='post_save'),
    path('profile/<int:pk>/followers/', views.FollowersView.as_view(), name='followers'),
    path('profile/<int:pk>/following/', views.FollowingView.as_view(), name='following'),
]
