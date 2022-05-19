from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User

class UserAuthBackend(BaseBackend):
    def authenticate(self, request=None, username=None, password=None):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None

class EmailBackend(BaseBackend):
    def authenticate(self, request=None, username=None, password=None):
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None
