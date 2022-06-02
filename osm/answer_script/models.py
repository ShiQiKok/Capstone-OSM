from django.db import models
from assessment.models import Assessment
from storage.custom_azure import AzureMediaStorage as AMS
from .validators import validate_answer_script_status, validate_comment
import enum

# Create your models here.
class ScriptStatus(enum.Enum):
    IN_PROGRESS = 'In Progress'
    FINISHED = 'Finished'
    NOT_STARTED = 'Not Started'

class AnswerScript(models.Model):

    student_name = models.CharField(max_length=50)
    student_id = models.CharField(max_length=50)
    status = models.JSONField(blank=False, validators=[validate_answer_script_status])
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    marks = models.JSONField(null=True, blank=True)
    answers = models.JSONField(null=True, blank=True)
    script = models.FileField(storage=AMS, upload_to='answer_scripts/', null=True, blank=True)
    comment = models.JSONField(null=True, blank=True, validators=[validate_comment])

    def __str__(self):
        return self.student_name
