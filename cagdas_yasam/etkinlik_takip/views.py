# views.py
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import LoginForm
from .models import Event
from django.utils import timezone
from .forms import QueryMemberForm, MemberForm
from .models import Member
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Member
from .serializers import MemberSerializer


class MemberUpdateDeleteAPIView(APIView):
    def get_object(self, pk):
        try:
            return Member.objects.get(pk=pk)
        except Member.DoesNotExist:
            return None

    def put(self, request, pk, format=None):
        member = self.get_object(pk)
        if member is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MemberSerializer(member, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        member = self.get_object(pk)
        if member is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class MemberListView(APIView):
    def get(self, request, *args, **kwargs):
        # Retrieve query parameters
        query_params = request.query_params
        
        # Filter queryset based on query parameters
        queryset = Member.objects.all()
        for key, value in query_params.items():
            if value:
                # Update the queryset to filter based on the provided parameter
                queryset = queryset.filter(**{key: value})

        serializer = MemberSerializer(queryset, many=True)
        return Response(serializer.data)



class MemberCreate(APIView):
    def post(self, request, format=None):
        serializer = MemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
