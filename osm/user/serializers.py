from rest_framework import serializers
from .models import User
from .manager import UserManager
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def createUser(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']

        validated_data.pop('password')
        validated_data.pop('email')

        user = User.objects.create_user(email, password, **validated_data)
        return user
