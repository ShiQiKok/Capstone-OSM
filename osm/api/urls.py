from django.urls import path, include
from user import urls as user_urls
from . import views

urlpatterns = [
   path('users/', include(user_urls)),
]