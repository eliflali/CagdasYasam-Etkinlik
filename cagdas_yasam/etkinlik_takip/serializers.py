from rest_framework import serializers
from .models import Member, Event, EventAttendance, Student

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'  # Include all fields from the model

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'  # Include all fields from the model

class EventSerializer(serializers.ModelSerializer):
    manager_student = StudentSerializer(read_only=True)
    manager_member = MemberSerializer(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'  # Include all fields from the model

class EventAttendanceSerializer(serializers.ModelSerializer):
    member = MemberSerializer(required=False)
    student = StudentSerializer(required=False)

    class Meta:
        model = EventAttendance
        fields = ['member', 'student', 'event', 'points_gained', 'personal_attendance_point', 'attendance_status_student', 'attendance_status_member']

    def validate(self, data):
        """
        Ensure that either a member or a student is set, but not both.
        """
        if data.get('member') and data.get('student'):
            raise serializers.ValidationError("Attendance must be linked to either a member or a student, not both.")
        if not data.get('member') and not data.get('student'):
            raise serializers.ValidationError("Attendance must be linked to either a member or a student.")
        return data
