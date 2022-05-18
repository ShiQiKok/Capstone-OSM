from rest_framework import serializers
from .models import User


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

    def update_password(self, id, new_password):
        user = User.objects.get(id=id)
        user.set_password(new_password)
        user.save()
        return user

class UserCollabSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']