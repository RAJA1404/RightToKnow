from django.core.management.base import BaseCommand
from rti.models import Department


class Command(BaseCommand):
    help = 'Creates 20 Tamil Nadu government departments in the database'

    def handle(self, *args, **kwargs):
        departments = [
            'School Education',
            'Higher Education',
            'Health and Family Welfare',
            'Finance',
            'Revenue and Disaster Management',
            'Home (Police)',
            'Agriculture',
            'Public Works Department (PWD)',
            'Transport',
            'Municipal Administration',
            'Rural Development',
            'Electricity (TNEB)',
            'Water Supply (TWAD)',
            'Social Welfare',
            'Labour',
            'Housing',
            'Industries',
            'Forest',
            'Commercial Taxes',
            'Adi Dravidar Welfare',
        ]

        created_count = 0
        for name in departments:
            dept, was_created = Department.objects.get_or_create(name=name)
            if was_created:
                self.stdout.write(self.style.SUCCESS(f'✅ Created: {name}'))
                created_count += 1
            else:
                self.stdout.write(self.style.WARNING(f'⚠️  Already exists: {name}'))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done! {created_count} new departments created. '
            f'Total departments in database: {Department.objects.count()}'
        ))
