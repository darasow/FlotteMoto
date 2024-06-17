from rest_framework import generics, mixins,permissions
from rest_framework.pagination import PageNumberPagination
from Utilisateur.permission import IsAdmin, IsManager
from .models import Moto
from .serializer import MotoSerializer
from rest_framework.permissions import IsAuthenticated

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class MotoGenericAPIView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = Moto.objects.all()
    serializer_class = MotoSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            permission_classes = [permissions.IsAuthenticated]
        elif self.request.method == 'POST':
            permission_classes = [IsAdmin | IsManager]  # Seuls les admins et manager peuvent créer
        elif self.request.method in ['PUT', 'PATCH']:
            permission_classes = [IsAdmin | IsManager]  # Admins et Managers peuvent modifier
        elif self.request.method == 'DELETE':
            permission_classes = [IsAdmin]  # Seuls les admins peuvent supprimer
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

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
class MotoNonContratAPIView(generics.ListAPIView):
        serializer_class = MotoSerializer
        permission_classes = [IsAuthenticated]

        def get_queryset(self):
            queryset = Moto.objects.filter(enContrat = False)
            return queryset
class MotoEnContratEmbaucheAPIView(generics.ListAPIView):
    serializer_class = MotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Moto.objects.filter(
            enContrat=True,  # Filtre pour les motos en contrat
            contrat__type_contrat='embauche',  # Filtre pour le type de contrat 'embauche'
            contrat__etat='en_cours'  # Facultatif: Assurez-vous que le contrat est en cours
        ).distinct()
        return queryset