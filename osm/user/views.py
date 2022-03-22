
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List':'/users/',
        'Detail View':'/user-detail/<uuid>/',
        'Create':'/user-create/',
        'Update':'/user-update/<uuid>/',
        'Delete':'/user-delete/<uuid>/',
    }

    return Response(api_urls)

@api_view(['GET'])
def users(request):
    users = User.objects.all().order_by('-id')
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def userDetails(request, uuid):
    user = User.objects.get(uuid=uuid)
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
def updateUser(request, uuid):
    user = User.objects.get(uuid=uuid)
    serializer = UserSerializer(instance=user, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def deleteUser(request, uuid):
    user = User.objects.get(uuid=uuid)
    user.delete()

    return Response("User successfully deleted")