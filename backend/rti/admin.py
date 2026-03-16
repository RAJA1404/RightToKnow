from django.contrib import admin
from .models import District, Department, RTIApplication, RTIUpdate, Notification

admin.site.register(District)
admin.site.register(Department)
admin.site.register(RTIApplication)
admin.site.register(RTIUpdate)
admin.site.register(Notification)