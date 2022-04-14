from django.db import models
from assessment.models import Assessment
from storage.custom_azure import AzureMediaStorage as AMS

# Create your models here.


class AnswerScript(models.Model):

    class ScriptStatus(models.TextChoices):
        IN_PROGRESS = 'In Progress', 'In Progress'
        FINISHED = 'Finished', 'Finished'
        NOT_STARTED = 'Not Started', 'Not Started'

    student_name = models.CharField(max_length=255)
    student_id = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20, choices=ScriptStatus.choices, default=ScriptStatus.NOT_STARTED)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    marks = models.JSONField(null=True, blank=True)
    answers = models.JSONField(null=True, blank=True)
    script = models.FileField(storage=AMS, upload_to='answer_scripts/', null=True, blank=True)

    def __str__(self):
        return self.student_name
