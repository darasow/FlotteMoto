from django.shortcuts import render
from rest_framework import viewsets
from .models import Role
from .serializer import RoleSerializer
from rest_framework.permissions import IsAuthenticated

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
