# Generated by Django 4.0.1 on 2022-05-24 06:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('assessment', '0001_initial'),
        ('answer_script', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answerscript',
            name='assessment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assessment.assessment'),
        ),
    ]
