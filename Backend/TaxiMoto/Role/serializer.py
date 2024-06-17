# serializers.py
from rest_framework import serializers
from .models import Role

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'authorization_level', 'created_by', 'created_at', 'modified_by', 'modified_at', 'status']
