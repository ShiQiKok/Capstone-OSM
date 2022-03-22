import uuid
from django.db import models

# Create your models here.
class User(models.Model):
    # using default=uuid.uuid4 has made UUID field auto-generated
    user_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # TODO: Add a field for the Assessment list