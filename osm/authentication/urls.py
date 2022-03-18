from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"), # default auth is login
    path('login/', views.login, name='login'),
    path('signup/', views.register, name='register'),
]