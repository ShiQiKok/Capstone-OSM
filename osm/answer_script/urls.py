from django.urls import path
from . import views

urlpatterns = [
   path('', views.overview, name='answer-overview'),
   path('answers/<int:assessment_id>', views.answers, name='answer-list'),
   path('answer-details/<int:id>/', views.answer_details, name='answer-details'),
   path('answer-create/', views.create_answer, name='answer-create'),
   path('answer-update/<int:id>/', views.update_answer, name='answer-update'),
   path('answer-delete/<int:id>/', views.delete_answer, name='answer-delete'),
]