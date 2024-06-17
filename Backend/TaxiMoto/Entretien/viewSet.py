from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Entretien
from .serializer import EntretienSerializer
from Utilisateur.permission import IsAdmin, IsManager


class EntretienViewSet(ModelViewSet):
    queryset = Entretien.objects.all()
    serializer_class = EntretienSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdmin | IsManager]  # CRU pour Manager et CRUD pour Admin
        elif self.action in ['retrieve', 'list']:
            permission_classes = [IsAuthenticated]  # R pour tous les utilisateurs authentifiés
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
 