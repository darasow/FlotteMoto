# utilisateur/serializers.py
from rest_framework import serializers
from .models import Utilisateur
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import Group
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 
            'type_utilisateur', 'telephone', 'adresse', 'date_embauche', 
            'enContrat', 'password'
        ]
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        
        instance.is_active = True
        instance.save()

        group_name = instance.type_utilisateur.capitalize()
        group, created = Group.objects.get_or_create(name=group_name)
        instance.groups.add(group)
        
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance   
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            'password': attrs['password'],
        }
        self.user = authenticate(**authenticate_kwargs)

        if not self.user or not self.user.is_active:
            raise serializers.ValidationError("Le compte utilisateur n'est pas actif ou les informations d'identification sont incorrectes.")

        data = super().validate(attrs)

        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data

        return data
