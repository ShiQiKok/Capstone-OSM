from rest_framework import serializers
from rest_framework.serializers import ValidationError
from .models import User
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['groups', 'user_permissions']

    def extract_data(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']

        validated_data.pop('password')
        validated_data.pop('email')

        return email, password, validated_data

    def create_user(self, validated_data):
        email, password, validated_data = self.extract_data(validated_data)
        user = User.objects.create_user(email, password, **validated_data)
        return user

    def create_superuser(self, validated_data):
        email, password, validated_data = self.extract_data(validated_data)
        user = User.objects.create_superuser(email, password, **validated_data)
        return user

class UserCollabSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']

class ChangePasswordSerializer(serializers.Serializer):
    model = User
    new_password = serializers.CharField(required=True)