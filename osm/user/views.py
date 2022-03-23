
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from .models import User

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def apiOverview(request):
    api_urls = {
        'getAll':'/users/',
        'get':'/user-detail/<uuid>/',
        'create':'/user-create/',
        'update':'/user-update/<uuid>/',
        'delete':'/user-delete/<uuid>/',
    }

    return Response(api_urls)

@api_view(['GET'])
def users(request):
    users = User.objects.all().order_by('-id')
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def userDetails(request, id):
    user = User.objects.get(id=id)
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)

@api_view(['GET','POST'])
def createUser(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['POST'])
def updateUser(request, id):
    user = User.objects.get(id=id)
    serializer = UserSerializer(instance=user, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def deleteUser(request, id):
    user = User.objects.get(id=id)
    user.delete()

    return Response("User successfully deleted")