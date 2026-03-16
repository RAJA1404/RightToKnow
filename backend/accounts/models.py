from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('citizen', 'Citizen'),
        ('dept_admin', 'Department Admin'),
        ('super_admin', 'Super Admin'),
    )
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    aadhaar_no = models.CharField(max_length=12, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='citizen')

    def __str__(self):
        return self.email
