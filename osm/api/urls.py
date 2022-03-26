from django.urls import path, include
import user.urls
import assessment.urls
import subject.urls
from . import views

urlpatterns = [
    path('users/', include(user.urls)),
    path('assessments/', include(assessment.urls)),
    path('subjects/', include(subject.urls))

]
