from rest_framework import generics, mixins, permissions
from rest_framework.pagination import PageNumberPagination
from Contrat.models import Contrat
from Utilisateur.permission import IsAdmin, IsManager
from .models import Entretien
from .serializer import EntretienSerializer
from rest_framework.exceptions import NotFound
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class EntretienGenericAPIView(
     mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = Entretien.objects.all()
    serializer_class = EntretienSerializer
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

class EntretienParChauffeurEnContratAPIView(generics.ListAPIView):
        serializer_class = EntretienSerializer
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
            return Entretien.objects.filter(moto=contrat_en_cours.moto)

        def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_paginated_response(self.get_serializer(page, many=True).data)
                return serializer

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)