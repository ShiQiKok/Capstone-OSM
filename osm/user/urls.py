from django.urls import path
from . import views

urlpatterns = [
   path('', views.apiOverview, name='user-overview'),
   path('users/', views.users, name='user-list'),
   path('user-details/<uuid:uuid>/', views.userDetails, name='user-details'),
   path('user-create/', views.createUser, name='user-create'),
   path('user-update/<uuid:uuid>/', views.updateUser, name='user-update'),
   path('user-delete/<uuid:uuid>/', views.deleteUser, name='user-delete'),
]