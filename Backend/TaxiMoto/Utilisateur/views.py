from datetime import date
from django.utils import timezone
from rest_framework import generics, mixins, permissions
from django.contrib.auth.models import User, Permission
from rest_framework.pagination import PageNumberPagination
from  Contrat.models import Contrat
from .permission import IsAdmin, IsManager
from rest_framework.exceptions import ValidationError
from .models import Utilisateur
from .serializer import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import MyTokenObtainPairSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = Utilisateur.objects.all()
    permission_classes = (permissions.AllowAny)
    serializer_class = UserSerializer
    
    def perform_create(self, serializer):
        user = serializer.save()
        if user.type_utilisateur == 'admin':
            user.is_superuser = True
            user.is_staff = True
            user.save()
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class UtilisateurGenericAPIView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = Utilisateur.objects.all()
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            permission_classes = [permissions.IsAuthenticated]
        elif self.request.method == 'POST':
            permission_classes = [IsAdmin | IsManager]  # Seuls les admins peuvent créer
        elif self.request.method in ['PUT', 'PATCH']:
            permission_classes = [IsAdmin | IsManager]  # Admins et Managers peuvent modifier
        elif self.request.method == 'DELETE':
            permission_classes = [IsAdmin]  # Seuls les admins peuvent supprimer
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user_data = self.request.data
        type_utilisateur = user_data.get('type_utilisateur')

        if type_utilisateur == 'chauffeur' and self.request.user.type_utilisateur == 'manager':
            Utilisateur.objects.create_chauffeur(
                username=user_data.get('username'),
                email=user_data.get('email'),
                password=user_data.get('password'),
                **{key: user_data[key] for key in user_data if key not in ['username', 'email', 'password']}
            )
        else:
            # For other cases, use the standard method which checks permissions
            if type_utilisateur in ['admin', 'manager'] and self.request.user.type_utilisateur != 'admin':
                raise ValidationError("Les managers ne peuvent pas créer des utilisateurs de type admin ou manager.")
            serializer.save()
            
    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
class ChauffeurLibreListView(generics.ListAPIView):
    queryset = Utilisateur.objects.filter(type_utilisateur='chauffeur')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Utilisateur.objects.filter(type_utilisateur='chauffeur', enContrat=False)
        return queryset

class ManagerListView(generics.ListAPIView):
    queryset = Utilisateur.objects.filter(type_utilisateur='manager')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
class ChauffeurByUsernameView(generics.RetrieveAPIView):
    queryset = Utilisateur.objects.filter(type_utilisateur='chauffeur')
    serializer_class = UserSerializer
    lookup_field = 'username'
    permission_classes = [permissions.IsAuthenticated]
class AdminListView(generics.ListAPIView):
    queryset = Utilisateur.objects.filter(type_utilisateur='admin')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
