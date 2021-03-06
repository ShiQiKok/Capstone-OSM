# Generated by Django 4.0.1 on 2022-05-24 06:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('subject', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Assessment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('type', models.CharField(choices=[('question_based', 'Question Based'), ('essay_based', 'Essay Based')], default='question_based', max_length=20)),
                ('marking_setting', models.CharField(choices=[('mark_by_script', 'Mark By Script'), ('mark_by_question', 'Mark By Question')], default='mark_by_script', max_length=20)),
                ('data_created', models.DateTimeField(auto_now_add=True)),
                ('rubrics', models.JSONField(blank=True, max_length=255, null=True)),
                ('questions', models.JSONField(blank=True, max_length=255, null=True)),
                ('markers', models.ManyToManyField(related_name='assessments', to=settings.AUTH_USER_MODEL)),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subject.subject')),
            ],
        ),
    ]
