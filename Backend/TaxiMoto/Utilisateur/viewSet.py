# views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Utilisateur
from .permission import CanCreateUser, IsAdmin, IsManager
from .serializer import UserSerializer
from django.core.exceptions import PermissionDenied

class UtilisateurViewSet(ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            if self.request.data.get('type_utilisateur') == 'chauffeur':
                if self.request.user.has_perm('Utilisateur.add_chauffeur'):
                    return [IsAuthenticated(), IsManager()]  # Seuls les managers peuvent créer des chauffeurs
                else:
                    raise PermissionDenied("Vous n'avez pas la permission de créer un chauffeur.")
            return [IsAuthenticated(), CanCreateUser()]  # Autres créations contrôlées par CanCreateUser
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin() | IsManager()]
        elif self.action in ['retrieve', 'list']:
            return [IsAuthenticated()]
        else:
            return [IsAuthenticated()]

    def perform_create(self, serializer):
        user_data = self.request.data
        type_utilisateur = user_data.get('type_utilisateur')

        if type_utilisateur == 'chauffeur':
            if self.request.user.has_perm('Utilisateur.add_utilisateur'):
                Utilisateur.objects.create_chauffeur(
                    username=user_data.get('username'),
                    email=user_data.get('email'),
                    password=user_data.get('password'),
                    **{key: user_data[key] for key in user_data if key not in ['username', 'email', 'password']}
                )
            else:
                raise PermissionDenied("Vous n'avez pas la permission de créer un chauffeur.")
        else:
            if type_utilisateur in ['admin', 'manager'] and not self.request.user.has_perm('Utilisateur.add_utilisateur'):
                raise serializer.ValidationError("Les managers ne peuvent pas créer des utilisateurs de type admin ou manager.")
            serializer.save()
