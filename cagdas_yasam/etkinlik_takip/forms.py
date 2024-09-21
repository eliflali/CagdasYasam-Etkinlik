from django import forms
from .models import Member, Student, Volunteers, Registered

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

class MemberForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = ['name', 'tc_number', 'total_volunteering_hours', 'start_time', 'end_time']

class QueryMemberForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = ['name', 'tc_number', 'total_volunteering_hours', 'start_time', 'end_time']
        widgets = {
            'start_time': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'end_time': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }
