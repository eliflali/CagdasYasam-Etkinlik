# Generated by Django 5.0.3 on 2024-04-12 12:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('etkinlik_takip', '0005_alter_eventattendance_unique_together'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='eventattendance',
            unique_together=set(),
        ),
    ]
