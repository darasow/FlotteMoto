# serializers.py

from rest_framework import serializers
from .models import Chauffeur

class ChauffeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chauffeur
        fields = '__all__'
        
# Optionnellement, vous pouvez personnaliser les champs si vous ne souhaitez pas inclure tous les champs.
# Par exemple, si vous voulez exclure les champs 'created_by' et 'modified_by', vous pouvez faire :

class ChauffeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chauffeur
        exclude = ('created_by', 'modified_by')
