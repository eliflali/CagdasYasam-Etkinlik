from rest_framework import serializers
from .models import (
    Member, 
    Event, 
    EventAttendance, 
    Student, 
    NativeDepartment, 
    HelperDepartment, 
    TargetGroup, 
    Department, 
    Project,
    Volunteers,
    Registered,
    VolunteeringStudent,
    ScholarshipStudent
)

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'
        extra_kwargs = {
            'name': {'required': False},
            'tc_number': {'required': False},
            'total_volunteering_hours': {'required': False},
            'start_time': {'required': False, 'allow_null': True},
            'end_time': {'required': False, 'allow_null': True},
        }


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'  # Include all fields from the model

class NativeDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NativeDepartment
        fields = '__all__'  # Include all fields from the model

class HelperDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelperDepartment
        fields = '__all__'  # Include all fields from the model
        
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'  # Include all fields from the model

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'  # Include all fields from the model


class VolunteersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteers
        fields = '__all__'

class RegisteredSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registered
        fields = '__all__'

class VolunteeringStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteeringStudent
        fields = '__all__'
        
class ScholarshipStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScholarshipStudent
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'  # Include all fields from the model

class TargetGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetGroup
        fields = '__all__'  # Include all fields from the model

class EventSerializer(serializers.ModelSerializer):
    manager_student = StudentSerializer(read_only=True)
    manager_member = MemberSerializer(read_only=True)
    native_departments = NativeDepartmentSerializer(many=True, read_only=True)
    helper_departments = HelperDepartmentSerializer(many=True, read_only=True)
    target_groups = TargetGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = '__all__'  # Include all fields from the model

class EventAttendanceSerializer(serializers.ModelSerializer):
    member = MemberSerializer(required=False)
    student = StudentSerializer(required=False)

    class Meta:
        model = EventAttendance
        fields = [
            'member', 'student', 'event', 'event_point', 'personal_attendance_point',
            'attendance_status_student', 'attendance_status_member', 'excuse'
        ]

    def validate(self, data):
        """
        Ensure that either a member or a student is set, but not both.
        """
        if data.get('member') and data.get('student'):
            raise serializers.ValidationError("Attendance must be linked to either a member or a student, not both.")
        if not data.get('member') and not data.get('student'):
            raise serializers.ValidationError("Attendance must be linked to either a member or a student.")
        return data
