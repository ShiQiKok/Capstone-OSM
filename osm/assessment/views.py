from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import AssessmentSerializer
from .models import Assessment

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def overview(request):
    api_urls = {
        'getAll':'assessments/',
        'get':'assessment-details/',
        'create':'assessment-create/',
        'update':'assessment-update/',
        'delete':'assessment-delete/',
    }

    return Response(api_urls)

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def assessments(request, user_id):
    assessments = Assessment.objects.filter(markers=user_id)
    serializer = AssessmentSerializer(assessments, many=True)

    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def assessment_details(request, id):
    assessment = Assessment.objects.get(id=id)
    serializer = AssessmentSerializer(assessment, many=False)

    return Response(serializer.data)

@api_view(['GET','POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def create_assessment(request):
    serializer = AssessmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def update_assessment(request, id):
    assessment = Assessment.objects.get(id=id)
    serializer = AssessmentSerializer(instance=assessment, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def delete_assessment(request, id):
    assessment = Assessment.objects.get(id=id)
    assessment.delete()

    return Response("Assessment successfully deleted")