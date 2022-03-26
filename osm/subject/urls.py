from django.urls import path
from . import views

urlpatterns = [
   path('', views.overview, name='subject-overview'),
   path('subjects/<int:user_id>', views.subjects, name='subject-list'),
   path('subject-details/<int:id>/', views.subject_details, name='subject-details'),
   path('subject-create/', views.create_subject, name='subject-create'),
   path('subject-update/<int:id>/', views.update_subject, name='subject-update'),
   path('subject-delete/<int:id>/', views.delete_subject, name='subject-delete'),
]