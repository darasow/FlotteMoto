from rest_framework import serializers

from Moto.serializer import MotoSerializer
from Utilisateur.serializer import UserSerializer
from .models import Contrat

class ContratSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    modified_by = serializers.ReadOnlyField(source='modified_by.username')
    created_at = serializers.ReadOnlyField()
    modified_at = serializers.ReadOnlyField()
    
    class Meta:
        model = Contrat
        # Inclure tous les champs du modèle
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['chauffeur'] = UserSerializer(instance.chauffeur).data
        representation['moto'] = MotoSerializer(instance.moto).data
        return representation
