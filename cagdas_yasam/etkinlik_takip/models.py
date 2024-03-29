from django.db import models
from django.utils.translation import gettext_lazy as _

class Event(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateTimeField()
    point = models.IntegerField()
    place = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name



class Member(models.Model):
    name = models.CharField(_("Ad"), max_length=100)
    mission = models.CharField(_("Görev"), max_length=100)
    school = models.CharField(_("Okul"), max_length=100, blank=True)
    department = models.CharField(_("Bölüm"), max_length=100, blank=True)
    student_class = models.CharField(_("Sınıf"), max_length=50, blank=True)  # 'class' is a reserved keyword in Python.
    group = models.CharField(_("Öbek"), max_length=100, blank=True)
    phone_number = models.CharField(_("Telefon Numarası"), max_length=20, blank=True)
    email = models.EmailField(_("E-posta"))
    tc_number = models.CharField(_("TC Kimlik No"), max_length=11)
    active = models.BooleanField(_("Aktif"), default=True)
    points_collected = models.IntegerField(_("Toplanan Puanlar"), default=0)

    def __str__(self):
        return self.name
