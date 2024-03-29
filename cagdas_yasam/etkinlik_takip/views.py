# views.py
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import LoginForm
from .models import Event
from django.utils import timezone
from .forms import QueryMemberForm, MemberForm
from .models import Member

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            # Simple check for username and password
            if username == 'cagdasyenisehir' and password == '12345':
                return redirect('mainpage')  # Redirect to the main page
            else:
                return HttpResponse("Invalid login.")
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})


def main_page(request):
    events = Event.objects.filter(date__gte=timezone.now()).order_by('date')  # Get upcoming events
    return render(request, 'mainpage.html', {'events': events})



def add_member(request):
    if request.method == 'POST':
        form = MemberForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('mainpage')  # Adjust the redirection as necessary
    else:
        form = MemberForm()
    return render(request, 'add_member.html', {'form': form})



def query_member(request):
    if request.method == 'GET' and request.GET:
        query_form = QueryMemberForm(request.GET)
        if query_form.is_valid():
            members = Member.objects.all()
            
            # Apply filters if a field is provided
            if query_form.cleaned_data['name']:
                members = members.filter(name__icontains=query_form.cleaned_data['name'])
            if query_form.cleaned_data['mission']:
                members = members.filter(mission__icontains=query_form.cleaned_data['mission'])
            if query_form.cleaned_data['school']:
                members = members.filter(mission__icontains=query_form.cleaned_data['school'])
            if query_form.cleaned_data['department']:
                members = members.filter(mission__icontains=query_form.cleaned_data['department'])
            if query_form.cleaned_data['student_class']:
                members = members.filter(mission__icontains=query_form.cleaned_data['student_class'])
            if query_form.cleaned_data['group']:
                members = members.filter(mission__icontains=query_form.cleaned_data['group'])
            if query_form.cleaned_data['phone_number']:
                members = members.filter(mission__icontains=query_form.cleaned_data['phone_number'])
            if query_form.cleaned_data['email']:
                members = members.filter(mission__icontains=query_form.cleaned_data['email'])
            if query_form.cleaned_data['tc_number']:
                members = members.filter(mission__icontains=query_form.cleaned_data['tc_number'])

            
            return render(request, 'query_member.html', {'form': query_form, 'members': members})
        
    elif request.method == 'POST':
        member = Member.objects.get(pk=request.POST.get('member_id'))
        form = MemberForm(request.POST, instance=member)
        if form.is_valid():
            form.save()
            # You might want to add a message stating the update was successful
            return render(request, 'member_detail.html', {'form': form, 'member': member})
        
    else:
        form = QueryMemberForm()
        return render(request, 'query_member.html', {'form': form})