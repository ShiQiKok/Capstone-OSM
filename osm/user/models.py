import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import UserManager

# Create your models here.
class User(AbstractUser):
    # using default=uuid.uuid4 has made UUID field auto-generated
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True, blank=False)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    # def __str__(self):
    #     return self.email