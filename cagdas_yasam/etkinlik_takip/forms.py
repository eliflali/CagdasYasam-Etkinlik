# forms.py
from django import forms
from .models import Member

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)


class MemberForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = ['name', 'mission', 'school', 'department', 'student_class', 'group', 'phone_number', 'email', 'tc_number', 'active', 'points_collected']

        #fields = ['İsim Soyisim', 'Görevi', 'Okul', 'Bölüm', 'Sınıfı', 'Öbek', 'Telefon Numarası', 'E-mail', 'TC Numarası', 'Hala Aktif', 'Toplam Puan']



class QueryMemberForm(forms.Form):
    name = forms.CharField(label='Ad', required=False)
    mission = forms.CharField(label='Görev', required=False)
    school = forms.CharField(label='Okul', required=False)
    department = forms.CharField(label='Bölüm', required=False)
    student_class = forms.CharField(label='Sınıf', required=False)
    group = forms.CharField(label='Grup', required=False)
    phone_number = forms.CharField(label='Telefon Numarası', required=False)
    email = forms.EmailField(label='E-posta', required=False)
    tc_number = forms.CharField(label='TC Kimlik No', required=False)
    # 'active' and 'points_collected' can be omitted or added depending on your search requirements
