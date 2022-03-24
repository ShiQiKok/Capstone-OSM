from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User

class UserAuthBackend(BaseBackend):
    def authenticate(self, request=None, username=None, password=None):
        try:
            user = User.objects.get(username=username)
            # print(user.password)
            # print(password)
            # print(check_password(password, user.password))
            if check_password(password, user.password):
                return user
            else:
                print("password not match")
        except User.DoesNotExist:
            return None
