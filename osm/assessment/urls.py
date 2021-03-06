from django.urls import path
from . import views

urlpatterns = [
   path('', views.overview, name='assessment-overview'),
   path('assessments/<int:user_id>', views.assessments, name='assessment-list'),
   path('assessment-details/<int:id>/', views.assessment_details, name='assessment-details'),
   path('assessment-create/', views.create_assessment, name='assessment-create'),
   path('assessment-update/<int:id>/', views.update_assessment, name='assessment-update'),
   path('assessment-delete/<int:id>/', views.delete_assessment, name='assessment-delete'),
   path('rubrics-upload/', views.upload_rubrics, name='rubrics-upload'),
   path('questions-upload/', views.upload_questions, name='questions-upload')
]