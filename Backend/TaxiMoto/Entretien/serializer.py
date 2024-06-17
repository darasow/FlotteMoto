from rest_framework import serializers

from Moto.serializer import MotoSerializer
from .models import Entretien

class EntretienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entretien
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['moto'] = MotoSerializer(instance.moto).data
        return representation