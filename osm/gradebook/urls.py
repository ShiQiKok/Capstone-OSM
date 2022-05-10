# urls.py
from django.urls import path

from .views import GradebookView

urlpatterns = [
    path('download/<assessment_id>', GradebookView.as_view(), name='download_gradebook'),
]
