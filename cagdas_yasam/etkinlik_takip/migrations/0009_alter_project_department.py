# Generated by Django 5.0.6 on 2024-09-21 20:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('etkinlik_takip', '0008_department_helperdepartment_nativedepartment_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='department',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='etkinlik_takip.nativedepartment'),
        ),
    ]
