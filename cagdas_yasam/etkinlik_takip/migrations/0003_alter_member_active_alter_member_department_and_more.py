# Generated by Django 5.0.3 on 2024-03-29 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('etkinlik_takip', '0002_member'),
    ]

    operations = [
        migrations.AlterField(
            model_name='member',
            name='active',
            field=models.BooleanField(default=True, verbose_name='Aktif'),
        ),
        migrations.AlterField(
            model_name='member',
            name='department',
            field=models.CharField(blank=True, max_length=100, verbose_name='Bölüm'),
        ),
        migrations.AlterField(
            model_name='member',
            name='email',
            field=models.EmailField(max_length=254, verbose_name='E-posta'),
        ),
        migrations.AlterField(
            model_name='member',
            name='group',
            field=models.CharField(blank=True, max_length=100, verbose_name='Grup'),
        ),
        migrations.AlterField(
            model_name='member',
            name='mission',
            field=models.CharField(max_length=100, verbose_name='Görev'),
        ),
        migrations.AlterField(
            model_name='member',
            name='name',
            field=models.CharField(max_length=100, verbose_name='Ad'),
        ),
        migrations.AlterField(
            model_name='member',
            name='phone_number',
            field=models.CharField(blank=True, max_length=20, verbose_name='Telefon Numarası'),
        ),
        migrations.AlterField(
            model_name='member',
            name='points_collected',
            field=models.IntegerField(default=0, verbose_name='Toplanan Puanlar'),
        ),
        migrations.AlterField(
            model_name='member',
            name='school',
            field=models.CharField(blank=True, max_length=100, verbose_name='Okul'),
        ),
        migrations.AlterField(
            model_name='member',
            name='student_class',
            field=models.CharField(blank=True, max_length=50, verbose_name='Sınıf'),
        ),
        migrations.AlterField(
            model_name='member',
            name='tc_number',
            field=models.CharField(max_length=11, verbose_name='TC Kimlik No'),
        ),
    ]