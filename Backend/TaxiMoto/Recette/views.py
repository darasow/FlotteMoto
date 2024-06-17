from rest_framework import generics, mixins, permissions

from Contrat.models import Contrat
from Utilisateur.permission import IsAdmin, IsManager
from .models import Recette
from .serializer import RecetteSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

   

class RecetteGenericAPIView(
      mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = Recette.objects.all()
    serializer_class = RecetteSerializer
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
    

class RecetteChauffeurAPIView(generics.ListAPIView):
    serializer_class = RecetteSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        # Filtrer les contrats du chauffeur qui sont à la fois en cours et de type 'credit'
        contrats_credit_en_cours = Contrat.objects.filter(
            chauffeur_id=user_id,
            etat='en_cours',
            type_contrat='credit'
        )

        # Récupérer toutes les recettes du chauffeur associées à ces contrats de type 'credit' en cours
        recettes = Recette.objects.filter(
            chauffeur_id=user_id,
            chauffeur__contrat__in=contrats_credit_en_cours
        )  # Vous pouvez changer l'ordre selon vos besoins
        return recettes

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_paginated_response(self.get_serializer(page, many=True).data)
            return serializer
        serializer = self.get_serializer(queryset, many=True)
        print(serializer.data)
        return Response(serializer.data)