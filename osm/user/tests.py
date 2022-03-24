from django.test import TestCase
from .models import User
from .serializers import UserSerializer

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        pass

    def test_create_custom_user_with_groups_n_permissions(self):
        data = {
            "password": "123qwe",
            "is_superuser": "false",
            "username": "user10",
            "is_staff": "false",
            "is_active": "true",
            "email": "user10@gmail.com",
            "first_name": "first",
            "last_name": "last",
            "groups": [],
            "user_permissions": []
        }

        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.create_user(serializer.data)

        assert serializer.is_valid()

    def test_create_custom_user_with_groups(self):
        data = {
            "password": "123qwe",
            "is_superuser": "false",
            "username": "user10",
            "is_staff": "false",
            "is_active": "true",
            "email": "user10@gmail.com",
            "first_name": "first",
            "last_name": "last",
            "groups": [],
        }

        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.create_user(serializer.data)

        assert serializer.is_valid()

    def test_create_custom_user(self):
        data = {
            "password": "123qwe",
            "is_superuser": "false",
            "username": "user10",
            "is_staff": "false",
            "is_active": "true",
            "email": "user10@gmail.com",
            "first_name": "first",
            "last_name": "last"
        }

        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.create_user(serializer.data)

        assert serializer.is_valid()

    def test_create_super_user(self):
        data = {
            "password": "123qwe",
            "is_superuser": "true",
            "username": "user10",
            "is_staff": "true",
            "is_active": "true",
            "email": "user10@gmail.com",
            "first_name": "first",
            "last_name": "last"
        }

        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.create_superuser(serializer.data)

        assert serializer.is_valid()

    def test_create_custom_user_with_invalid_data(self):
        data_no_email = {
            "password": "123qwe",
            "is_superuser": "false",
            "username": "user10",
            "is_staff": "false",
            "is_active": "true",
            "first_name": "first",
            "last_name": "last"
        }

        data_no_password = {
            "is_superuser": "false",
            "username": "user10",
            "is_staff": "false",
            "is_active": "true",
            "email": "user10@gmail.com",
            "first_name": "first",
            "last_name": "last"
        }

        data_no_username = {
            "password": "123qwe",
            "is_superuser": "false",
            "is_staff": "false",
            "is_active": "true",
            "email": "user10@gmail.com",
            "first_name": "first",
            "last_name": "last"
        }

        data_no_first_name = {
            "password": "123qwe",
            "is_superuser": "false",
            "username": "user10",
            "is_staff": "false",
            "is_active": "true",
            "email": "user10@gmail.com",
            "last_name": "last"
        }

        data_no_last_name = {
            "password": "123qwe",
            "is_superuser": "false",
            "username": "user10",
            "is_staff": "false",
            "is_active": "true",
            "email": "user10@gmail.com",
            "first_name": "first"
        }

        invalid_data = [data_no_email, data_no_password, data_no_username, data_no_first_name, data_no_last_name]

        for invalid in invalid_data:
            serializer = UserSerializer(data=invalid)

            if serializer.is_valid():
                user = serializer.create_user(serializer.data)
            else:
                assert serializer.is_valid() == False