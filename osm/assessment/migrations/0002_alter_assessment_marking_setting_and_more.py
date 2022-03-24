# Generated by Django 4.0.1 on 2022-03-24 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessment',
            name='marking_setting',
            field=models.CharField(choices=[('mark_by_script', 'Mark By Script'), ('mark_by_question', 'Mark By Question')], default='mark_by_script', max_length=20),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='questions',
            field=models.JSONField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='rubrics',
            field=models.JSONField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='type',
            field=models.CharField(choices=[('question_based', 'Question Based'), ('essay_based', 'Essay Based')], default='question_based', max_length=20),
        ),
    ]
