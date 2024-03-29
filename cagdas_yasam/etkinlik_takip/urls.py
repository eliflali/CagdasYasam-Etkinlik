# urls.py
from django.urls import path
from .views import login_view, main_page, add_member, query_member


urlpatterns = [
    
    path('main/', main_page, name='mainpage'),  # Main page at the root URL
    path('add_member', add_member, name = 'add_member'),
    path('query_member', query_member, name = 'query_member'),
    path('', login_view, name='login'),
] 
