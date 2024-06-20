from rest_framework import mixins, generics,permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from Utilisateur.permission import IsAdmin, IsManager
from .models import Contrat
from .serializer import ContratSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class ContratGenericAPIView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = Contrat.objects.all()
    serializer_class = ContratSerializer
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
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            contrat = serializer.save()
            if contrat.etat == 'en_cours':
                contrat.moto.enContrat = True
                contrat.chauffeur.enContrat = True
                contrat.moto.save()
                contrat.chauffeur.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()  # L'instance actuelle du contrat
        old_chauffeur = instance.chauffeur  # L'ancien chauffeur
        old_moto = instance.moto  # L'ancienne moto

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            contrat = serializer.save()

            # Libérer l'ancienne moto et le chauffeur
            if old_chauffeur:
                old_chauffeur.enContrat = False
                old_chauffeur.save()
            if old_moto:
                old_moto.enContrat = False
                old_moto.save()

            # Mettre à jour le statut du nouveau chauffeur et de la nouvelle moto
            if contrat.etat in ['termine', 'annule']:
                contrat.moto.enContrat = False
                contrat.chauffeur.enContrat = False
            else:
                contrat.moto.enContrat = True
                contrat.chauffeur.enContrat = True

            contrat.moto.save()
            contrat.chauffeur.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()
    
    def get_queryset(self):
        queryset = self.queryset
        filter_param = self.request.query_params.get('filter', None)
        search_query = self.request.query_params.get('search', None)
        
        if filter_param:
            if filter_param == 'embauche':
                queryset = queryset.filter(type_contrat='embauche')
            elif filter_param == 'credit':
                queryset = queryset.filter(type_contrat='credit')
            elif filter_param == 'en_cours':
                queryset = queryset.filter(etat='en_cours')
            elif filter_param == 'termine':
                queryset = queryset.filter(etat='termine')
            elif filter_param == 'annule':
                queryset = queryset.filter(etat='annule')
        return queryset
class ContratsEnCoursAPIView(generics.ListAPIView):
    serializer_class = ContratSerializer

    def get_queryset(self):
        return Contrat.objects.filter(etat='en_cours')
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
