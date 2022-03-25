from django.test import TestCase
from .models import Assessment
import requests

# Create your tests here.
class AssessmentTestCase(TestCase):
    def setup(self):
        pass


    def test_assessment_model(self):
        r = requests.get("http://localhost:8000/api/assessments/")
        print(r.text)

