from django.urls import path
from . import views

urlpatterns = [
    path('districts/', views.get_districts),
    path('departments/', views.get_departments),
    path('apply/', views.file_rti),
    path('my-applications/', views.my_applications),
    path('track/<str:application_no>/', views.track_application),
    path('dept-applications/', views.dept_applications),
    path('update-status/<int:pk>/', views.update_status),
    path('analytics/', views.analytics),
    path('dashboard-stats/', views.dashboard_stats),
    path('notifications/', views.notifications),
    path('notifications/read/', views.mark_notifications_read),
]