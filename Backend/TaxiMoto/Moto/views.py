from rest_framework import generics, mixins,permissions
from rest_framework.pagination import PageNumberPagination
from Utilisateur.permission import IsAdmin, IsManager
from .models import Moto
from .serializer import MotoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
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
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['id', 'numero_serie', 'couleur']  # Champs sur lesquels effectuer une recherche
    filterset_fields = ['enContrat']  # Champs sur lesquels effectuer un filtrage
    ordering_fields = ['id', 'numero_serie', 'couleur']  # Champs sur lesquels effectuer un tri

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
    
    def get_queryset(self):
        queryset = self.queryset
        filter_param = self.request.query_params.get('filter', None)
        # Filtrage par paramètre de recherche
        search_query = self.request.query_params.get('search', None)
        if search_query:
                queryset = queryset.filter(numero_serie__icontains=search_query) | \
                        queryset.filter(couleur__icontains=search_query)

        # Filtrage par paramètre de filtre
        if filter_param and filter_param != 'All':
            if filter_param == 'enContrat':
                queryset = queryset.filter(enContrat=True)
            elif filter_param == 'libre':
                queryset = queryset.filter(enContrat=False)
            # Ajoutez d'autres filtres si nécessaire

        return queryset
    
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