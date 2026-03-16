from django.db import migrations, models
import django.db.models.deletion


def add_departments(apps, schema_editor):
    Department = apps.get_model('rti', 'Department')
    departments = [
        'Revenue Department',
        'Police Department',
        'Health & Family Welfare',
        'Education Department',
        'Public Works Department',
        'Agriculture Department',
        'Rural Development',
        'Urban Development',
        'Water Supply & Drainage',
        'Electricity (TANGEDCO)',
        'Transport Department',
        'Labour Department',
        'Social Welfare Department',
        'Adi Dravidar Welfare',
        'Backward Classes Welfare',
        'Housing & Urban Development',
        'Industries Department',
        'Information Technology',
        'Forest Department',
        'Fisheries Department',
        'Animal Husbandry',
        'Highways Department',
        'Municipal Administration',
        'Panchayat Raj Department',
        'Registration Department',
        'Commercial Taxes',
        'Land Administration',
        'Tourism Department',
        'Food & Consumer Protection',
        'Environment Department',
    ]
    for name in departments:
        Department.objects.get_or_create(name=name)


class Migration(migrations.Migration):

    dependencies = [
        ('rti', '0002_add_districts'),
    ]

    operations = [
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='rtiapplication',
            name='department',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rti.department'),
        ),
        migrations.RunPython(add_departments, migrations.RunPython.noop),
    ]
