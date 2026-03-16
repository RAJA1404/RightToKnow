from django.db import migrations


def add_districts(apps, schema_editor):
    District = apps.get_model('rti', 'District')
    names = [
        'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
        'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
        'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam',
        'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
        'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur',
        'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupattur',
        'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram',
        'Virudhunagar', 'Kanniyakumari',
    ]
    for name in names:
        District.objects.get_or_create(name=name)


class Migration(migrations.Migration):

    dependencies = [
        ('rti', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_districts, migrations.RunPython.noop),
    ]
