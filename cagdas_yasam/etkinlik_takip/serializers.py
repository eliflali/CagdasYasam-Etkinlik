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
    class Meta:
        model = Event
        fields = '__all__'

    def create(self, validated_data):
        # Pop the many-to-many fields and foreign key fields
        target_groups = validated_data.pop('target_groups', [])
        native_departments = validated_data.pop('native_departments', [])
        helper_departments = validated_data.pop('helper_departments', [])

        # Handle manager_student if it's a dictionary
        manager_student = validated_data.get('manager_student')
        if isinstance(manager_student, dict):
            student_id = manager_student.get('id')
            if student_id:
                validated_data['manager_student'] = Student.objects.get(id=student_id)
            else:
                validated_data['manager_student'] = None

        # Handle manager_member if it's a dictionary
        manager_member = validated_data.get('manager_member')
        if isinstance(manager_member, dict):
            member_id = manager_member.get('id')
            if member_id:
                validated_data['manager_member'] = Member.objects.get(id=member_id)
            else:
                validated_data['manager_member'] = None

        # Create the event instance without m2m fields
        event = Event.objects.create(**validated_data)

        # Set the many-to-many fields after creation
        if target_groups:
            event.target_groups.set(target_groups)
        if native_departments:
            event.native_departments.set(native_departments)
        if helper_departments:
            event.helper_departments.set(helper_departments)

        return event

    def update(self, instance, validated_data):
        # Handle many-to-many fields separately
        target_groups = validated_data.pop('target_groups', None)
        native_departments = validated_data.pop('native_departments', None)
        helper_departments = validated_data.pop('helper_departments', None)

        # Handle manager_student if it's a dictionary
        manager_student = validated_data.get('manager_student')
        if isinstance(manager_student, dict):
            student_id = manager_student.get('id')
            if student_id:
                validated_data['manager_student'] = Student.objects.get(id=student_id)
            else:
                validated_data['manager_student'] = None

        # Handle manager_member if it's a dictionary
        manager_member = validated_data.get('manager_member')
        if isinstance(manager_member, dict):
            member_id = manager_member.get('id')
            if member_id:
                validated_data['manager_member'] = Member.objects.get(id=member_id)
            else:
                validated_data['manager_member'] = None

        # Update the instance with other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update many-to-many fields if provided
        if target_groups is not None:
            instance.target_groups.set(target_groups)
        if native_departments is not None:
            instance.native_departments.set(native_departments)
        if helper_departments is not None:
            instance.helper_departments.set(helper_departments)

        return instance

class EventAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendance
        fields = ['id', 'member', 'event', 'event_point']

    def validate_member(self, value):
        try:
            if isinstance(value, int):
                return Member.objects.get(id=value)
            return value
        except Member.DoesNotExist:
            raise serializers.ValidationError("Invalid member ID")

    def validate_event(self, value):
        try:
            if isinstance(value, int):
                return Event.objects.get(id=value)
            return value
        except Event.DoesNotExist:
            raise serializers.ValidationError("Invalid event ID")

    def create(self, validated_data):
        # Check if attendance already exists
        existing_attendance = EventAttendance.objects.filter(
            member=validated_data['member'],
            event=validated_data['event']
        ).first()

        if existing_attendance:
            raise serializers.ValidationError("Member is already added to this event")

        return super().create(validated_data)
