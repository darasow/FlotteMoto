from rest_framework import generics, mixins, permissions

from Contrat.models import Contrat
from Utilisateur.permission import IsAdmin, IsManager
from .models import Panne
from .serializer import PanneSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

   
class PanneGenericAPIView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = Panne.objects.all()
    serializer_class = PanneSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['numero_serie', ]  # Champs sur lesquels effectuer une recherche
    filterset_fields = ['etat']  # Champs sur lesquels effectuer un filtrage
    ordering_fields = ['numero_serie']  # Champs sur lesquels effectuer un tri

    
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
        search_query = self.request.query_params.get('search', None)
        
        if filter_param and filter_param != 'All':
            if filter_param == 'corigee':
                # Filtrage par état corrigé
                queryset = queryset.filter(etat='corrigee')
            if filter_param == 'non_corigee':
                queryset = queryset.filter(etat='non_corrigee')

            # Ajoutez d'autres filtres si nécessaire
        return queryset

class PannesParChauffeurEnContratAPIView(generics.ListAPIView):
        serializer_class = PanneSerializer
        pagination_class = StandardResultsSetPagination
        permission_classes = [permissions.IsAuthenticated]

        def get_queryset(self):
            chauffeur_id = self.kwargs.get('chauffeur_id')

            # Trouver un contrat en cours pour le chauffeur
            contrat_en_cours = Contrat.objects.filter(
                chauffeur_id=chauffeur_id,
                etat='en_cours',
                type_contrat = 'embauche'
            ).first()

            if not contrat_en_cours:
                raise NotFound('Aucun contrat en cours trouvé pour ce chauffeur')

            # Filtrer les pannes pour la moto liée au contrat en cours
            return Panne.objects.filter(moto=contrat_en_cours.moto)

        def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_paginated_response(self.get_serializer(page, many=True).data)
                return serializer

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)