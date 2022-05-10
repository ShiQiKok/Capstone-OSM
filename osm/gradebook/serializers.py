from rest_framework import serializers
from answer_script.models import AnswerScript

class GradebookAnswerScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerScript
        fields = ['student_name', 'student_id', 'marks']



