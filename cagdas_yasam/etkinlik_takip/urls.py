# urls.py
from django.urls import path
from .views import login_view, main_page, add_member, query_member
from .views import MemberCreate
from .views import MemberListView
from .views import MemberUpdateDeleteAPIView
from .views import EventCreate
from .views import EventListView
from .views import EventUpdateDeleteAPIView
from .views import AddMemberToEventView

urlpatterns = [
    path('members/', MemberCreate.as_view(), name='member-create'),
    path('events/', EventCreate.as_view(), name='event-create'),
    path('members_list/', MemberListView.as_view(), name='members-list'),
    path('events_list/', EventListView.as_view(), name='events-list'),
    path('main/', main_page, name='mainpage'),  # Main page at the root URL
    path('add_member', add_member, name = 'add_member'),
    path('query_member', query_member, name = 'query_member'),
    path('', login_view, name='login'),
    path('members/<int:pk>/', MemberUpdateDeleteAPIView.as_view(), name='member-update-delete'),
    path('events/<int:pk>/', EventUpdateDeleteAPIView.as_view(), name='event-update-delete'),
    path('add_attendance/', AddMemberToEventView.as_view(), name='add-attendance'),
] 
