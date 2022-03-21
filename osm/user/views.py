# from django.shortcuts import render
# from django.views.decorators.csrf import csrf_exempt
# from .models import User

# # Create your views here.
# def user_detail():
#     return HttpResponse("Hello, world. You're at the user detail.")

# @csrf_exempt
# def user_list(request):
#     data = User.objects.all()

#     if request.method == "GET":
#         serializer = UserSerializer(data, many=True)
#         return JsonResponse(serializer.data, safe=False)


# from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import UserSerializer
from .models import User


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# class GroupViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer
#     permission_classes = [permissions.IsAuthenticated]