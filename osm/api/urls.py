from django.urls import path, include
import user.urls
import assessment.urls
import subject.urls
import answer_script.urls
import gradebook.urls

urlpatterns = [
    path('users/', include(user.urls)),
    path('assessments/', include(assessment.urls)),
    path('subjects/', include(subject.urls)),
    path('answers/', include(answer_script.urls)),
    path('gradebook/', include(gradebook.urls)),
]
