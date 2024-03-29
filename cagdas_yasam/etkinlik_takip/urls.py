# urls.py
from django.urls import path
from .views import login_view, main_page, add_member, query_member
from .views import MemberCreate

urlpatterns = [
    path('members/', MemberCreate.as_view(), name='member-create'),
    path('main/', main_page, name='mainpage'),  # Main page at the root URL
    path('add_member', add_member, name = 'add_member'),
    path('query_member', query_member, name = 'query_member'),
    path('', login_view, name='login'),
] 
