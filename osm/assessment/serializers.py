from rest_framework import serializers
from .models import Assessment


class AssessmentSerializer(serializers.ModelSerializer):

    def validate(self, attr):
        fields = list(attr.keys())

        # either one (question and rubrics must be provided)
        if 'questions' not in fields and 'rubrics' not in field:
            raise serializers.ValidationError("Either questions or rubrics must be provided.")

        # while both are provided, they can't be null at the same time (front-end creation case)
        if 'questions' in fields and 'rubrics' in fields:
            if attr['questions'] is None and attr['rubrics'] is None:
                raise serializers.ValidationError("Questions and rubrics cannot hold null value at the same time.")

        return attr


    class Meta:
        model = Assessment
        fields = '__all__'
