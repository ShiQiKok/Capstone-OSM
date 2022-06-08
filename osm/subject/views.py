from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import SubjectSerializer
from .models import Subject

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def overview(request):
    api_urls = {
        'getAll':'subjects/',
        'get':'subject-details/',
        'create':'subject-create/',
        'update':'subject-update/',
        'delete':'subject-delete/',
    }

    return Response(api_urls)

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def subjects(request, user_id):
    subjects = Subject.objects.filter(markers=user_id)
    serializer = SubjectSerializer(subjects, many=True)

    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def subject_details(request, id):
    try:
        subject = Subject.objects.get(id=id)
        serializer = SubjectSerializer(subject, many=False)
    except:
        return Response({"error": "Subject not found!"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data)

@api_view(['GET','POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def create_subject(request):
    serializer = SubjectSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def update_subject(request, id):
    subject = Subject.objects.get(id=id)
    serializer = SubjectSerializer(instance=subject, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def delete_subject(request, id):
    subject = Subject.objects.get(id=id)
    subject.delete()

    return Response("Subject successfully deleted")