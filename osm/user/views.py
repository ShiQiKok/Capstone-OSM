from django.core.mail import send_mail
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserSerializer, UserCollabSerializer
from .models import User
from .validators import validate_password
from django.contrib.auth.hashers import check_password
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError


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
        'checkPassword': 'user-check-password/',
        'checkEmail': 'user-check-email/',
        'resetPassword': 'reset-password/',
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


@api_view(['GET', 'POST'])
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

    if (check_password(request.data['currentPassword'], user.password)):
        update_request = request._request
        try:
            validate_password(request.data['newPassword'])
            user.set_password(request.data['newPassword'])

            update_request.POST = {
                "username": user.username,
                "email": user.email,
                "password": user.password,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
            return updateUser(update_request, id)
        except Exception as e:
            return Response({'password': e.message}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({
            'password': ['The password provided is incorrect.']
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def checkEmail(request):
    email = request.data['email']
    users = User.objects.filter(email=email)

    if users.exists():
        for user in users:
            SUBJECT = 'OSM - Reset your password'
            template = 'reset-password-template.txt'
            data = {
                'protocol': 'http',
                'domain': 'localhost:4200',
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': default_token_generator.make_token(user),
            }
            message = render_to_string(template, data)

            send_mail(
                SUBJECT,
                message,
                settings.EMAIL_HOST_USER,
                ['shiqi_kok@hotmail.com'],
                fail_silently=False,
            )

        return Response('Email was sent!')
    return Response({'error': 'No user found with this email!'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def resetPassword(request, uidb64, token):
    id = urlsafe_base64_decode(uidb64).decode()
    new_password = request.data['newPassword']

    try:
        user = User.objects.get(id=id)
        if (default_token_generator.check_token(user, token)):
            validate_password(new_password)
            user.set_password(new_password)
            user.save()

            return Response('updated!')
        else:
            return Response('Invalid token', status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as e:
        return Response({'password': e.message}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'error': "Something went wrong. Please try again"}, status=status.HTTP_400_BAD_REQUEST)
