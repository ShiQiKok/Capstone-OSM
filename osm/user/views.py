from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserSerializer, UserCollabSerializer
from .models import User
from django.contrib.auth.hashers import check_password


@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([])
def apiOverview(request):
    api_urls = {
        'getAll': 'users/',
        'get': 'user-detail/',
        'getBy': 'user-get-by/',
        'getList': 'user-get-list/',
        'create': 'user-create/',
        'update': 'user-update/',
        'delete': 'user-delete/',
        'check': 'user-check-password/',
        'collab': 'user-collab/',
    }

    return Response(api_urls)


@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAdminUser])
def users(request):
    users = User.objects.all().order_by('-id')
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def usersCollab(request):
    users = User.objects.all().order_by('-id')
    serializer = UserCollabSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def usersGetBy(request):
    if ('data' in request.data.keys()):
        data = request.data['data']

        try:
            user = User.objects.get(username=data)
            serializer = UserCollabSerializer(user, many=False)
            return Response(serializer.data)
        except:
            try:
                user = User.objects.get(email=data)
                serializer = UserCollabSerializer(user, many=False)
                return Response(serializer.data)
            except:
                return Response('Please post valid data', status=status.HTTP_400_BAD_REQUEST)

    return Response('No data found', status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def usersGetList(request):
    if ('list' in request.data.keys()):
        data = request.data['list']

        if (type(data) != list):
            return Response('Please post a list', status=status.HTTP_400_BAD_REQUEST)

        users = [User.objects.get(id=d) for d in data]
        serializer = UserCollabSerializer(users, many=True)
        return Response(serializer.data)


    return Response('No data found', status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def userDetails(request, id):
    user = User.objects.get(id=id)
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def createUser(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.create_user(serializer.data)
        user_serializer = UserSerializer(user, many=False)
        return Response(user_serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def updateUser(request, id):
    user = User.objects.get(id=id)
    serializer = UserSerializer(instance=user, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def deleteUser(request, id):
    user = User.objects.get(id=id)
    user.delete()

    return Response("User successfully deleted")


@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def updatePassword(request, id):
    user = User.objects.get(id=id)
    serializer = UserSerializer(instance=user)

    if (check_password(request.data['currentPassword'], user.password)):
        updated_user = serializer.update_password(
            id, request.data['newPassword'])
        serializer = UserSerializer(instance=updated_user)

        return Response(serializer.data)

    else:
        return Response({'detail': 'The password provided is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
