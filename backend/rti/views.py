from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import District, Department, RTIApplication, RTIUpdate, Notification

@api_view(['GET'])
@permission_classes([AllowAny])
def get_districts(request):
    districts = District.objects.all()
    data = [{'id': d.id, 'name': d.name} for d in districts]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_departments(request):
    departments = Department.objects.all()
    data = [{'id': d.id, 'name': d.name} for d in departments]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def file_rti(request):
    user = request.user
    data = request.data
    district = District.objects.get(id=data['district'])
    department = None
    if data.get('department'):
        department = Department.objects.get(id=data['department'])
    rti = RTIApplication.objects.create(
        user=user,
        district=district,
        department=department,
        subject=data['subject'],
        description=data['description'],
        document=request.FILES.get('document', None)
    )
    Notification.objects.create(
        user=user,
        message=f'Your RTI {rti.application_no} submitted successfully!'
    )
    return Response({
        'message': 'RTI filed successfully!',
        'application_no': rti.application_no
    }, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    applications = RTIApplication.objects.filter(user=request.user).order_by('-created_at')
    data = []
    for app in applications:
        data.append({
            'id': app.id,
            'application_no': app.application_no,
            'subject': app.subject,
            'district': app.district.name,
            'department': app.department.name if app.department else '',
            'status': app.status,
            'created_at': app.created_at.strftime('%d-%m-%Y'),
        })
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def track_application(request, application_no):
    try:
        app = RTIApplication.objects.get(
            application_no=application_no,
            user=request.user
        )
        updates = RTIUpdate.objects.filter(application=app).order_by('updated_at')
        updates_data = [{
            'status': u.status,
            'remarks': u.remarks,
            'updated_at': u.updated_at.strftime('%d-%m-%Y %H:%M'),
        } for u in updates]
        return Response({
            'application_no': app.application_no,
            'subject': app.subject,
            'district': app.district.name,
            'department': app.department.name if app.department else '',
            'status': app.status,
            'created_at': app.created_at.strftime('%d-%m-%Y'),
            'updates': updates_data,
        })
    except RTIApplication.DoesNotExist:
        return Response({'error': 'Application not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dept_applications(request):
    if request.user.role != 'dept_admin':
        return Response({'error': 'Unauthorized'}, status=403)
    applications = RTIApplication.objects.all().order_by('-created_at')
    data = []
    for app in applications:
        data.append({
            'id': app.id,
            'application_no': app.application_no,
            'subject': app.subject,
            'district': app.district.name,
            'department': app.department.name if app.department else '',
            'citizen': app.user.email,
            'status': app.status,
            'created_at': app.created_at.strftime('%d-%m-%Y'),
        })
    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_status(request, pk):
    if request.user.role not in ['dept_admin', 'super_admin']:
        return Response({'error': 'Unauthorized'}, status=403)
    try:
        app = RTIApplication.objects.get(id=pk)
        new_status = request.data.get('status')
        remarks = request.data.get('remarks', '')
        app.status = new_status
        app.save()
        RTIUpdate.objects.create(
            application=app,
            status=new_status,
            remarks=remarks,
            updated_by=request.user
        )
        Notification.objects.create(
            user=app.user,
            message=f'Your RTI {app.application_no} status updated to {new_status}'
        )
        return Response({'message': 'Status updated successfully!'})
    except RTIApplication.DoesNotExist:
        return Response({'error': 'Application not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics(request):
    if request.user.role != 'super_admin':
        return Response({'error': 'Unauthorized'}, status=403)
    total = RTIApplication.objects.count()
    submitted = RTIApplication.objects.filter(status='SUBMITTED').count()
    in_progress = RTIApplication.objects.filter(status='IN_PROGRESS').count()
    responded = RTIApplication.objects.filter(status='RESPONDED').count()
    closed = RTIApplication.objects.filter(status='CLOSED').count()
    district_data = []
    for d in District.objects.all():
        district_data.append({
            'district': d.name,
            'total': RTIApplication.objects.filter(district=d).count()
        })
    return Response({
        'total': total,
        'submitted': submitted,
        'in_progress': in_progress,
        'responded': responded,
        'closed': closed,
        'district_wise': district_data,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user_apps = RTIApplication.objects.filter(user=request.user)
    total = user_apps.count()
    pending = user_apps.filter(status__in=['SUBMITTED', 'RECEIVED', 'IN_PROGRESS']).count()
    responded = user_apps.filter(status__in=['RESPONDED', 'CLOSED']).count()
    return Response({
        'total': total,
        'pending': pending,
        'responded': responded,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    notifs = Notification.objects.filter(user=request.user).order_by('-created_at')
    data = [{
        'id': n.id,
        'message': n.message,
        'is_read': n.is_read,
        'created_at': n.created_at.strftime('%d-%m-%Y %H:%M'),
    } for n in notifs]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'message': 'All notifications marked as read'})