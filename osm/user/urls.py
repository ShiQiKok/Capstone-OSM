from django.urls import path
from . import views

urlpatterns = [
   path('', views.apiOverview, name='user-overview'),
   path('users/', views.users, name='user-list'),
   path('user-collab/', views.usersCollab, name='user-collab-list'),
   path('user-get-by/', views.usersGetBy, name='user-get-by'),
   path('user-get-list/', views.usersGetList, name='user-get-list'),
   path('user-details/<int:id>/', views.userDetails, name='user-details'),
   path('user-create/', views.createUser, name='user-create'),
   path('user-update/<int:id>/', views.updateUser, name='user-update'),
   path('user-delete/<int:id>/', views.deleteUser, name='user-delete'),
   path('user-check-password/<int:id>', views.updatePassword, name='user-check-password'),
]