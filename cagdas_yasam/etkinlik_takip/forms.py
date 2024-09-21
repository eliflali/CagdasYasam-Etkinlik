from django import forms
from .models import Member, Student, Volunteers, Registered

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

class MemberForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = ['name', 'tc_number', 'total_volunteering_hours', 'start_time', 'end_time']

class QueryMemberForm(forms.Form):
    name = forms.CharField(label='Ad', required=False)
    tc_number = forms.CharField(label='TC Kimlik No', required=False)
    start_time = forms.DateTimeField(label='Başlangıç Zamanı', required=False)
    end_time = forms.DateTimeField(label='Bitiş Zamanı', required=False)
