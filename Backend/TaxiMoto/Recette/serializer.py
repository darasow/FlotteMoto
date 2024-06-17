# Recette/serializers.py

from rest_framework import serializers

from Contrat.models import Contrat
from django.db.models import Sum
from .models import Recette
from Contrat.serializer import ContratSerializer  # Importer le ContratSerializer

class RecetteSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    modified_by = serializers.ReadOnlyField(source='modified_by.username')
    created_at = serializers.ReadOnlyField()
    modified_at = serializers.ReadOnlyField()
    # total_recettes = serializers.SerializerMethodField()
    # chauffeur = serializers.SerializerMethodField()

    class Meta:
        model = Recette
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['chauffeur'] = self.get_chauffeur(instance)
        return representation
    
    def get_chauffeur(self, instance):
        chauffeur_data = {
            'id': instance.chauffeur.id,
            'username': instance.chauffeur.username,
            'first_name': instance.chauffeur.first_name,
            'last_name': instance.chauffeur.last_name,
            'telephone': instance.chauffeur.telephone,
            'adresse': instance.chauffeur.adresse,
            'date_embauche': instance.chauffeur.date_embauche,
            'enContrat': instance.chauffeur.enContrat,
            'contrat': self.get_contrat(instance.chauffeur),
            'total_recettes': self.get_total_recettes(instance.chauffeur)
        }
        return chauffeur_data
    
    def get_contrat(self, chauffeur):
        try:
            contrat = chauffeur.contrat_set.first()  # Assurez-vous que votre relation s'appelle correctement dans votre modèle Utilisateur
            if contrat:
                return ContratSerializer(contrat).data
            else:
                return None
        except Contrat.DoesNotExist:
            return None
    
    def get_total_recettes(self, chauffeur):
        return Recette.objects.filter(chauffeur=chauffeur).aggregate(total=Sum('montant'))['total'] or 0