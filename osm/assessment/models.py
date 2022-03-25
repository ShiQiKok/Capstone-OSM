from django.db import models

# Create your models here.
class Assessment(models.Model):

    class AssessmentType(models.TextChoices):
        QUESTION_BASED = 'question_based', 'Question Based'
        ESSAY_BASED = 'essay_based', 'Essay Based'

    class MarkingSetting(models.TextChoices):
        MARK_BY_SCRIPT = 'mark_by_script', 'Mark By Script'
        MARK_BY_QUESTION = 'mark_by_question', 'Mark By Question'

    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=AssessmentType.choices, default=AssessmentType.QUESTION_BASED)
    marking_setting = models.CharField(max_length=20, choices=MarkingSetting.choices, default=MarkingSetting.MARK_BY_SCRIPT)
    data_created = models.DateTimeField(auto_now_add=True)
    rubrics = models.JSONField(max_length=255, blank=True)
    questions = models.JSONField(max_length=255, blank=True)
    markers = models.ManyToManyField('user.User', related_name='assessments')

    def __str__(self):
        return self.name

class Rubrics:
    class RubricCriteria:
        # constructor with vairables title, total_marks, and levels
        def __init__(self, title, total_marks, levels):
            self.title = title
            self.total_marks = total_marks
            self.levels = levels

        def __str__(self):
            return {
                'title': self.title,
                'total_marks': self.total_marks,
                'levels': self.levels
            }


    class RubricCriteriaLevel:
        def __init__(self, name, description, mark_range):
            self.name = name
            self.description= description
            self.mark_range = mark_range

        def __str__(self):
            return {
                self.name: {
                    "description": self.description,
                    "mark_range": self.mark_range
                }
            }

    def __init__(self, levels, criteria):
        self.levels = levels
        self.criteria = criteria

    def __str__(self):
        return {
            "levels": self.levels,
            "criteria": self.criteria
        }

class Question:
    # constructor with variables question, answer, mark_allocation
    def __init__(self, question, answer, mark_allocation):
        self.question = question
        self.answer = answer
        self.mark_allocation = mark_allocation

    def __str__(self):
        return {
            'question': self.question,
            'answer': self.answer,
            'mark_allocation': self.mark_allocation
        }