from django.db import models

# Create your models here.
class Subject(models.Model):
    name = models.CharField(max_length=100, blank=False)
    markers = models.ManyToManyField('user.User', related_name='subjects')

    def __str__(self):
        return self.name