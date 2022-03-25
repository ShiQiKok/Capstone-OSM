# Generated by Django 4.0.1 on 2022-03-24 10:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Assessment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('subject', models.CharField(max_length=255)),
                ('type', models.CharField(max_length=255)),
                ('marking_setting', models.CharField(max_length=255)),
                ('data_created', models.DateTimeField(auto_now_add=True)),
                ('rubrics', models.JSONField(max_length=255)),
                ('questions', models.JSONField(max_length=255)),
                ('collaborators', models.ManyToManyField(related_name='assessments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]