# serializer.py
from rest_framework import serializers
from .models import Moto

class MotoSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    modified_by = serializers.ReadOnlyField(source='modified_by.username')
    
    created_at = serializers.ReadOnlyField()
    modified_at = serializers.ReadOnlyField()

    class Meta:
        model = Moto
        fields = ('id', 'numero_serie', 'couleur', 'date_achat', 'created_by', 'modified_by', 'created_at', 'modified_at', 'enContrat')
