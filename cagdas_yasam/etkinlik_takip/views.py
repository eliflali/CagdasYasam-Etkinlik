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
from .models import EventAttendance
from .serializers import MemberSerializer
from .serializers import EventSerializer
from .serializers import EventAttendanceSerializer
from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .forms import LoginForm, QueryMemberForm, MemberForm
from .models import Member, Event, EventAttendance, NativeDepartment, HelperDepartment, Project, TargetGroup, Department, Membership, Registered, Volunteers, Student, VolunteeringStudent, ScholarshipStudent, StudentMembership
from .serializers import MemberSerializer, EventSerializer, EventAttendanceSerializer, NativeDepartmentSerializer, HelperDepartmentSerializer, DepartmentSerializer, ProjectSerializer, TargetGroupSerializer, StudentSerializer, VolunteeringStudentSerializer, ScholarshipStudentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from itertools import chain
from rest_framework.exceptions import ValidationError

from .serializers import VolunteersSerializer, RegisteredSerializer

class VolunteersCreate(generics.CreateAPIView):
    queryset = Volunteers.objects.all()
    serializer_class = VolunteersSerializer
    
class VolunteerStudentCreate(generics.CreateAPIView):
    queryset = VolunteeringStudent.objects.all()
    serializer_class = VolunteeringStudentSerializer

class RegisteredCreate(generics.CreateAPIView):
    queryset = Registered.objects.all()
    serializer_class = RegisteredSerializer
    
class ScholarshipStudentCreate(generics.CreateAPIView):
    queryset = ScholarshipStudent.objects.all()
    serializer_class = ScholarshipStudentSerializer
# Views for Department creation
class DepartmentCreate(generics.CreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class CombinedDepartmentCreate(APIView):
    def post(self, request, format=None):
        # First, create the Department
        department_data = {
            "name": request.data.get("name"),
            "category": request.data.get("category")
        }
        department_serializer = DepartmentSerializer(data=department_data)
        if department_serializer.is_valid():
            department = department_serializer.save()

            # Then, create the NativeDepartment
            if request.data.get("department_type") == "native":
                native_department_data = {
                    "name": request.data.get("name"),
                    "category": request.data.get("category")
                }
                native_department_serializer = NativeDepartmentSerializer(data=native_department_data)
                if native_department_serializer.is_valid():
                    native_department = native_department_serializer.save()
                    return Response({
                        "department": department_serializer.data,
                        "native_department": native_department_serializer.data
                    }, status=status.HTTP_201_CREATED)
                else:
                    return Response(native_department_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"department": department_serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(department_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NativeDepartmentCreate(generics.CreateAPIView):
    queryset = NativeDepartment.objects.all()
    serializer_class = NativeDepartmentSerializer

class HelperDepartmentCreate(generics.CreateAPIView):
    queryset = HelperDepartment.objects.all()
    serializer_class = HelperDepartmentSerializer

# Department List View to handle both Native and Helper Departments
class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

# Views for Project creation
class ProjectCreate(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        # The department object is directly passed from the frontend
        department = serializer.validated_data.get('department')

        if not isinstance(department, Department):
            raise ValidationError("Invalid department object. Please ensure the department is correct.")

        # Save the project with the given department
        serializer.save(department=department)

class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

# View for Membership (adding members to departments and projects)

class MembershipCreate(APIView):
    def post(self, request, format=None):
        data = request.data
        member_id = data.get('member')
        department_id = data.get('department')
        project_ids = data.get('projects', [])

        # Fetch the member and department
        member = get_object_or_404(Member, id=member_id)
        department = get_object_or_404(Department, id=department_id)  # Ensure this fetches from the Department model

        # Create the membership
        membership, created = Membership.objects.get_or_create(member=member, department=department)

        # Add projects to the membership
        for project_id in project_ids:
            project = get_object_or_404(Project, id=project_id)
            membership.projects.add(project)

        membership.save()
        return Response({"message": "Member added to department and projects successfully."}, status=status.HTTP_201_CREATED)
    
class StudentMembershipCreate(APIView):
    def post(self, request, format=None):
        data = request.data
        student_id = data.get('student')
        department_id = data.get('department')
        project_ids = data.get('projects', [])

        # Fetch the member and department
        student = get_object_or_404(Student, id=student_id)
        department = get_object_or_404(Department, id=department_id)  # Ensure this fetches from the Department model

        # Create the membership
        membership, created = StudentMembership.objects.get_or_create(student=student, department=department)

        # Add projects to the membership
        for project_id in project_ids:
            project = get_object_or_404(Project, id=project_id)
            membership.projects.add(project)

        membership.save()
        return Response({"message": "Member added to department and projects successfully."}, status=status.HTTP_201_CREATED)

class DepartmentProjectsListView(APIView):
    def get(self, request, department_id, format=None):
        department = get_object_or_404(Department, id=department_id)
        projects = department.projects.all()  # Assuming the relationship is set in the model
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class MemberListAllView(generics.ListAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    
class StudentListAllView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


# Views for Target Group creation

class TargetGroupCreate(generics.CreateAPIView):
    queryset = TargetGroup.objects.all()
    serializer_class = TargetGroupSerializer

class TargetGroupListView(generics.ListAPIView):
    queryset = TargetGroup.objects.all()
    serializer_class = TargetGroupSerializer



class RemoveAttendeeView(APIView):
    def delete(self, request, event_id, member_id):
        try:
            attendance = get_object_or_404(EventAttendance, event_id=event_id, member_id=member_id)
            member = attendance.member
            member.points_collected -= attendance.points_gained  # Decrease the points
            member.save()
            attendance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class EventAttendeesView(APIView):
    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        attendees = EventAttendance.objects.filter(event=event)
        serializer = EventAttendanceSerializer(attendees, many=True)
        print(serializer.data)
        return Response(serializer.data)
    
class AddMemberToEventView(APIView):
    def post(self, request, *args, **kwargs):
        # Ensure member is sent as integer
        if isinstance(request.data.get('member'), dict):
            request.data['member'] = request.data['member'].get('id')
            
        serializer = EventAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            event_attendance = serializer.save()
            member = event_attendance.member
            
            # Update member's points using the point field
            member.points_collected += event_attendance.point  # Changed from points_gained to point
            member.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AddStudentToEventView(APIView):   
    def post(self, request, *args, **kwargs):
        serializer = EventAttendanceSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            event_attendance = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AddStudentToEventView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = EventAttendanceSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            # Save the EventAttendance instance
            event_attendance = serializer.save()
            
            # Fetch the Member instance related to the EventAttendance
            student = event_attendance.student
            
            # Update the member's points_collected
            student.points_collected += event_attendance.points_gained
            student.save()
            
            # Return the updated EventAttendance data
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # If the serializer is not valid, return an error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


# Department List View to handle only Native Departments for project creation
class NativeDepartmentListView(generics.ListAPIView):
    queryset = NativeDepartment.objects.all()
    serializer_class = NativeDepartmentSerializer
    
class HelperDepartmentListView(generics.ListAPIView):
    queryset = HelperDepartment.objects.all()
    serializer_class = HelperDepartmentSerializer
    
class NativeDepartmentCreate(generics.CreateAPIView):
    queryset = NativeDepartment.objects.all()
    serializer_class = NativeDepartmentSerializer

class HelperDepartmentCreate(generics.CreateAPIView):
    queryset = HelperDepartment.objects.all()
    serializer_class = HelperDepartmentSerializer


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
    
class StudentUpdateDeleteAPIView(APIView):
    def get_object(self, pk):
        try:
            return Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return None

    def put(self, request, pk, format=None):
        student = self.get_object(pk)
        if student is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        student = self.get_object(pk)
        if student is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class MemberListView(APIView):
    def get(self, request, *args, **kwargs):
        query_params = request.query_params
        queryset = Member.objects.all()

        # Apply filters if corresponding query parameters are provided
        if 'name' in query_params:
            queryset = queryset.filter(name__icontains=query_params['name'])
        if 'tc_number' in query_params:
            queryset = queryset.filter(tc_number__icontains=query_params['tc_number'])
        if 'total_volunteering_hours' in query_params:
            queryset = queryset.filter(total_volunteering_hours=query_params['total_volunteering_hours'])
        if 'start_time' in query_params:
            queryset = queryset.filter(start_time__gte=query_params['start_time'])
        if 'end_time' in query_params:
            queryset = queryset.filter(end_time__lte=query_params['end_time'])

        serializer = MemberSerializer(queryset, many=True)
        return Response(serializer.data)


    
class StudentListView(APIView):
    def get(self, request, *args, **kwargs):
        query_params = request.query_params
        queryset = Student.objects.all()

        # Apply filters if corresponding query parameters are provided
        if 'name' in query_params:
            queryset = queryset.filter(name__icontains=query_params['name'])
        if 'tc_number' in query_params:
            queryset = queryset.filter(tc_number__icontains=query_params['tc_number'])
        if 'total_volunteering_hours' in query_params:
            queryset = queryset.filter(total_volunteering_hours=query_params['total_volunteering_hours'])
        if 'start_time' in query_params:
            queryset = queryset.filter(start_time__gte=query_params['start_time'])
        if 'end_time' in query_params:
            queryset = queryset.filter(end_time__lte=query_params['end_time'])

        serializer = StudentSerializer(queryset, many=True)
        return Response(serializer.data)



class MemberCreate(APIView):
    def post(self, request, format=None):
        serializer = MemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class StudentCreate(APIView):
    def post(self, request, format=None):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventCreate(APIView):
    def post(self, request, format=None):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventListView(APIView):
    def get(self, request, *args, **kwargs):
        # Retrieve query parameters
        query_params = request.query_params
        
        # Filter queryset based on query parameters
        queryset = Event.objects.all()
        for key, value in query_params.items():
            if value:
                # Update the queryset to filter based on the provided parameter
                queryset = queryset.filter(**{key: value})

        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)
    
class EventUpdateDeleteAPIView(APIView):
    def get_object(self, pk):
        try:
            return Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return None

    def put(self, request, pk, format=None):
        event = self.get_object(pk)
        if event is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        event = self.get_object(pk)
        if event is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MemberDetailView(APIView):
    def get(self, request, pk):
        member = get_object_or_404(Member, pk=pk)
        serializer = MemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class StudentDetailView(APIView):
    def get(self, request, pk):
        member = get_object_or_404(Student, pk=pk)
        serializer = StudentSerializer(member)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
