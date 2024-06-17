from rest_framework import serializers

from Moto.serializer import MotoSerializer
from .models import Panne

class PanneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panne
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['moto'] = MotoSerializer(instance.moto).data
        return representation