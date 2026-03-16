from django.db import models
from accounts.models import User
import uuid

class District(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class RTIApplication(models.Model):
    STATUS_CHOICES = [
        ('SUBMITTED', 'Submitted'),
        ('RECEIVED', 'Received'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESPONDED', 'Responded'),
        ('CLOSED', 'Closed'),
    ]
    application_no = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    subject = models.CharField(max_length=300)
    description = models.TextField()
    document = models.FileField(upload_to='rti_docs/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUBMITTED')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.application_no:
            self.application_no = 'RTI' + str(uuid.uuid4()).upper()[:8]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.application_no

class RTIUpdate(models.Model):
    application = models.ForeignKey(RTIApplication, on_delete=models.CASCADE, related_name='updates')
    status = models.CharField(max_length=20)
    remarks = models.TextField(blank=True)
    response_document = models.FileField(upload_to='rti_responses/', blank=True, null=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)