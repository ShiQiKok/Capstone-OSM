from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import AnswerScriptSerializer
from .models import AnswerScript

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def overview(request):
    api_urls = {
        'getAll':'answers/',
        'get':'answer-details/',
        'create':'answer-create/',
        'update':'answer-update/',
        'delete':'answer-delete/',
    }

    return Response(api_urls)

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def answers(request, assessment_id):
    answers = AnswerScript.objects.filter(assessment_id=assessment_id)
    serializer = AnswerScriptSerializer(answers, many=True)

    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def answer_details(request, id):
    answer = AnswerScript.objects.get(id=id)
    serializer = AnswerScriptSerializer(answer, many=False)

    return Response(serializer.data)

@api_view(['GET','POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def create_answer(request):
    serializer = AnswerScriptSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def update_answer(request, id):
    answer = AnswerScript.objects.get(id=id)
    serializer = AnswerScriptSerializer(instance=answer, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def delete_answer(request, id):
    answer = AnswerScript.objects.get(id=id)
    answer.delete()

    return Response("AnswerScript successfully deleted")