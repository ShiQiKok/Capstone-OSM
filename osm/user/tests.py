from django.test import TestCase
from .models import User

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(email="user1@gmail.com", first_name="John", last_name="Doe", password="user1")
        User.objects.create(email="user2@gmail.com", first_name="", last_name="", password="user2")

    def test_validate_name(self):
        user1 = User.objects.get(email="user1@gmail.com")
        self.assertEqual(user1.first_name.isalpha(), True)
        self.assertEqual(user1.last_name.isalpha(), True)


    def test_user_email(self):
        user1 = User.objects.get(email="user1@gmail.com")
        self.assertEqual(user1.first_name, "user")