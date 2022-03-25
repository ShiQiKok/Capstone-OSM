from django.urls import path, include
import user.urls
import assessment.urls
from . import views

urlpatterns = [
   path('users/', include(user.urls)),
   path('assessments/', include(assessment.urls))
]