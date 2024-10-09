from django.urls import path
from .views import login_view, main_page, add_member, query_member
from .views import (
    MemberCreate,
    MemberListView,
    MemberUpdateDeleteAPIView,
    EventCreate,
    EventListView,
    EventUpdateDeleteAPIView,
    AddMemberToEventView,
    EventAttendeesView,
    MemberDetailView,
    RemoveAttendeeView,
    NativeDepartmentCreate,
    HelperDepartmentCreate,
    DepartmentListView,
    ProjectCreate,
    ProjectListView,
    MembershipCreate,
    TargetGroupCreate,
    TargetGroupListView,
    VolunteersCreate,
    RegisteredCreate,
    NativeDepartmentListView,
    DepartmentProjectsListView,
    DepartmentCreate,
    CombinedDepartmentCreate,
    StudentCreate,
    VolunteerStudentCreate,
    ScholarshipStudentCreate,
    StudentListView,
    StudentUpdateDeleteAPIView,
    StudentDetailView,
    StudentMembershipCreate
)

urlpatterns = [
    path('', login_view, name='login'),
    path('main/', main_page, name='mainpage'),
    path('add_member', add_member, name='add_member'),
    path('query_member', query_member, name='query_member'),
    
    # Member URLs
    path('volunteers/', VolunteersCreate.as_view(), name='volunteers-create'),
    path('registered/', RegisteredCreate.as_view(), name='registered-create'),
    path('members/', MemberCreate.as_view(), name='member-create'),
    path('members_list/', MemberListView.as_view(), name='members-list'),
    path('members/<int:pk>/', MemberUpdateDeleteAPIView.as_view(), name='member-update-delete'),
    path('memberslist/<int:pk>/', MemberDetailView.as_view(), name='member-detail'),
    
    # Student URLs
    path('volunteer_students/', VolunteerStudentCreate.as_view(), name='volunteer-students-create'),
    path('scholarship_students/', ScholarshipStudentCreate.as_view(), name='scholarship-students-create'),
    path('students/', StudentCreate.as_view(), name='student-create'),
    path('student_list/', StudentListView.as_view(), name='students-list'),
    path('students/<int:pk>/', StudentUpdateDeleteAPIView.as_view(), name='students-update-delete'),
    path('studentslist/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),
    
    # Event URLs
    path('events/', EventCreate.as_view(), name='event-create'),
    path('events_list/', EventListView.as_view(), name='events-list'),
    path('events/<int:pk>/', EventUpdateDeleteAPIView.as_view(), name='event-update-delete'),
    path('add_attendance/', AddMemberToEventView.as_view(), name='add-attendance'),
    path('events/<int:event_id>/attendees/', EventAttendeesView.as_view(), name='event-attendees'),
    path('events/<int:event_id>/remove-attendee/<int:member_id>/', RemoveAttendeeView.as_view(), name='remove-attendee'),
    
    # Department URLs
    path('departments/native/', NativeDepartmentCreate.as_view(), name='native-department-create'),
    path('departments/helper/', HelperDepartmentCreate.as_view(), name='helper-department-create'),
    path('departments-create/', CombinedDepartmentCreate.as_view(), name='departments-create'),
    path('departments/', DepartmentListView.as_view(), name='departments-list'),
    path('native-departments/', NativeDepartmentListView.as_view(), name='native-departments-list'),

    
    # Project URLs
    path('projects/', ProjectCreate.as_view(), name='project-create'),
    path('projects_list/', ProjectListView.as_view(), name='projects-list'),
    path('departments/<int:department_id>/projects/', DepartmentProjectsListView.as_view(), name='department-projects-list'),
    
    # Membership (adding members to departments and projects) URLs
    path('memberships/', MembershipCreate.as_view(), name='membership-create'),
    path('student_memberships/', StudentMembershipCreate.as_view(), name='student-membership-create'),
    # Target Group URLs
    path('target-groups/', TargetGroupCreate.as_view(), name='target-group-create'),
    path('target-groups_list/', TargetGroupListView.as_view(), name='target-groups-list'),
    
    # Department Creation URLs for React Form
    path('native-departments/', NativeDepartmentCreate.as_view(), name='native-department-create'),
    path('helper-departments/', HelperDepartmentCreate.as_view(), name='helper-department-create'),
    
]
