from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError  # Import ValidationError

# Department - Member - Project relations

class Department(models.Model):
    name = models.CharField(_("Birim"), max_length=50)

    def __str__(self):
        return self.name

# Define the NativeDepartment model
class NativeDepartment(models.Model):
    category = models.CharField(max_length=100)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# Define the HelperDepartment model
class HelperDepartment(models.Model):
    category = models.CharField(max_length=100)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Project(models.Model):
    name = models.CharField(_("Proje"), max_length=50)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='projects')

    def __str__(self):
        return self.name


    
class Member(models.Model):
    name = models.CharField(_("Ad"), max_length=100)
    tc_number = models.CharField(_("TC Kimlik No"), max_length=11)
    total_volunteering_hours = models.IntegerField(_("Toplam Gönüllü Saat"), default=0, blank = True)
    departments = models.ManyToManyField(Department, through='Membership', related_name='members', blank = True)
    start_time = models.DateTimeField(null = True)
    end_time = models.DateTimeField(null = True)

    def __str__(self):
        return self.name
    
class Volunteers(Member):
    status = models.CharField(_("Durum (Burslu/Gönüllü)"), default="VolunteeringMember", max_length=100)
    
class Registered(Member):
    status = models.CharField(_("Durum (Burslu/Gönüllü)"), default="Member", max_length=100)

class Membership(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    projects = models.ManyToManyField(Project, blank=True)
    start_time = models.DateTimeField(null = True)
    end_time = models.DateTimeField(null = True)

    def __str__(self):
        return f"{self.member.name} - {self.department.name}"

class Student(models.Model):
    name = models.CharField(_("Ad"), max_length=100)
    email = models.EmailField(_("E-posta"))
    tc_number = models.CharField(_("TC Kimlik No"), max_length=11)
    school = models.CharField(_("Okul"), max_length=100, blank=True)
    department = models.CharField(_("Bölüm"), max_length=100, blank=True)
    student_class = models.CharField(_("Sınıf"), max_length=50, blank=True)
    phone_number = models.CharField(_("Telefon Numarası"), max_length=20, blank=True)
    active = models.BooleanField(_("Aktif"), default=True, blank = True)
    points_collected = models.IntegerField(_("Toplanan Puanlar"), default=0, blank = True)
    total_volunteering_hours = models.IntegerField(_("Toplam Gönüllü Saat"), default=0, blank = True)
    start_time = models.DateTimeField(null = True)
    end_time = models.DateTimeField(null = True)

    def __str__(self):
        return self.name

class ScholarshipStudent(Student):
    mission = models.CharField(_("Görev"), max_length=100)
    group = models.CharField(_("Öbek"), max_length=100, blank=True)
    status = models.CharField(_("Durum (Burslu/Gönüllü)"), default="ScholarshipStudent", max_length=100)

    def __str__(self):
        return f"{self.name} - {self.status}"

class VolunteeringStudent(Student):
    status = models.CharField(_("Durum (Burslu/Gönüllü)"), default="VolunteeringStudent", max_length=100)

    def __str__(self):
        return f"{self.name} - {self.status}"

class StudentMembership(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    projects = models.ManyToManyField(Project, blank=True)
    start_time = models.DateTimeField(null = True)
    end_time = models.DateTimeField(null = True)

    def __str__(self):
        return f"{self.student.name} - {self.department.name}"
    
# Define the TargetGroup model
class TargetGroup(models.Model):
    TARGET_GROUP_CHOICES = [
        ('BURS_VERENLER', 'Burs Verenler'),
        ('BURSLU_OGRENCILER', 'Burslu Öğrenciler'),
        ('COCUKLAR', 'Çocuklar'),
        ('GENCLER', 'Gençler'),
        ('GONULLULER', 'Gönüllüler'),
        ('KADINLAR', 'Kadınlar'),
        ('MEDYA_KAMUOYU', 'Medya - Kamuoyu'),
        ('OGRENCILER', 'Öğrenciler'),
        ('KURUMSAL_SIRKETLER_STO', 'Kurumsal Şirketler - STÖ\'ler'),
        ('RESMI_KURUMLAR_YEREL_YONETIMLER', 'Resmi Kurumlar - Yerel Yönetimler'),
        ('OGRENCILER_YETISKINLER', 'Öğrenciler-Yetişkinler'),
        ('UYELER', 'Üyeler'),
        ('VELILER', 'Veliler'),
        ('UYELER_VE_GONULLULER', 'Üyeler ve Gönüllüler'),
        ('HALK', 'Halk'),
        ('YONETIM_KURULU', 'Yönetim Kurulu'),
        ('ESNAF', 'Esnaf'),
    ]

    name = models.CharField(max_length=255, choices=TARGET_GROUP_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

class Event(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateTimeField(blank = True)
    start_time = models.DateTimeField(null = True)
    end_time = models.DateTimeField(null = True)
    category = models.CharField(max_length=50, default = "")
    explanation  = models.CharField(max_length=255, null = True)
    event_type = models.CharField(max_length=50, null = True)
    point = models.IntegerField()
    place = models.CharField(max_length=255, blank=True, null=True)
    manager_student = models.OneToOneField(
        'Student', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_events'
    )
    manager_member = models.OneToOneField(
        'Member', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_events'
    )
    target_groups = models.ManyToManyField(TargetGroup, related_name='events', blank = True)  # Add this line
    native_departments = models.ManyToManyField(NativeDepartment, related_name='native_events', blank=True)
    helper_departments = models.ManyToManyField(HelperDepartment, related_name='helper_events', blank=True)
    attendant_from_other = models.IntegerField(default = 0, blank = True)
    attendant_from_us = models.IntegerField(default = 0, blank = True)
    def clean(self):
        # Ensuring only one manager is set
        if self.manager_student and self.manager_member:
            raise ValidationError(_("An event can only have one manager: either a student or a member, not both."))

    def __str__(self):
        return self.name


class EventAttendance(models.Model):
    ATTENDANCE_STATUS_STUDENT = [
        ('attended', _('Attended')),
        ('excused', _('Has Excuse')),
        ('not_attended', _('Not Attended')),
    ]

    ATTENDANCE_STATUS_MEMBER = [
        ('attended', _('Attended')),
        ('not_attended', _('Not Attended')),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='attended_events', null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attended_events', null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attending_members')
    event_point = models.IntegerField(default=0)
    personal_attendance_point = models.IntegerField(default=0)
    attendance_status_student = models.CharField(max_length=15, choices=ATTENDANCE_STATUS_STUDENT, null=True, blank=True)
    attendance_status_member = models.CharField(max_length=15, choices=ATTENDANCE_STATUS_MEMBER, null=True, blank=True)
    excuse = models.TextField(_("Excuse"), blank=True, null=True)

    class Meta:
        unique_together = ('member', 'student', 'event')  # Ensuring uniqueness

    def clean(self):
        # Ensure that either a member or a student is set, but not both
        if self.member and self.student:
            raise ValidationError(_("Attendance must be linked to either a member or a student, not both."))
        if not self.member and not self.student:
            raise ValidationError(_("Attendance must be linked to a member or a student."))
        
        # Ensure that excuse is only provided if the status is "excused"
        if self.attendance_status_student != 'excused' and self.excuse:
            raise ValidationError(_("Excuse can only be provided if the attendance status is 'excused'."))
        if self.attendance_status_student == 'excused' and not self.excuse:
            raise ValidationError(_("An excuse must be provided if the attendance status is 'excused'."))

    def __str__(self):
        if self.member:
            return f"{self.member.name} attended {self.event.name}"
        elif self.student:
            return f"{self.student.name} attended {self.event.name}"
        return "Attendance record"
