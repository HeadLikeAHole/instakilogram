from django.urls import path, include
from knox import views as knox_views

from . import views


urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    # knox view
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('profile/<int:pk>/', views.ProfileView.as_view(), name='profile'),
]
