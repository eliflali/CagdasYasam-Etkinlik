# Generated by Django 5.0.6 on 2024-09-21 21:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('etkinlik_takip', '0009_alter_project_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='department',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='etkinlik_takip.department'),
        ),
    ]
