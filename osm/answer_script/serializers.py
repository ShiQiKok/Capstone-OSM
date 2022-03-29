from rest_framework import serializers
from .models import AnswerScript

class AnswerScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerScript
        fields = '__all__'



