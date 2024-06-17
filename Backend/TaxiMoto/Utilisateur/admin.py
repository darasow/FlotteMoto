from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms

from .models import Utilisateur
from Moto.models import Moto
from Recette.models import Recette
from Entretien.models import Entretien
from Contrat.models import Contrat
from Panne.models import Panne
from django.contrib.auth.models import Permission

class UtilisateurCreationForm(forms.ModelForm):
    """Form for creating new users, including necessary fields and type selection."""
    class Meta:
        model = Utilisateur
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'type_utilisateur')

class UtilisateurAdmin(BaseUserAdmin):
    add_form = UtilisateurCreationForm
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'type_utilisateur', 'is_active', 'is_staff')}
        ),
    )

    # Configurez les champs affichés dans le formulaire d'administration
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'type_utilisateur')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if request.user.groups.filter(name='manager').exists():
            # Restreindre les champs visibles aux managers
            form.base_fields['type_utilisateur'].choices = [('chauffeur', 'Chauffeur')]
        return form

    def save_model(self, request, obj, form, change):
        if not change and request.user.groups.filter(name='manager').exists():
            # Enregistrement spécifique pour les managers : créer uniquement des chauffeurs
            obj.type_utilisateur = 'chauffeur'
        super().save_model(request, obj, form, change)

# Enregistre tous les modèles pour lesquels tu as défini des permissions
admin.site.register(Moto)
admin.site.register(Contrat)
admin.site.register(Panne)
admin.site.register(Entretien)
admin.site.register(Recette)

# Enregistre également les permissions pour ces modèles
admin.site.register(Permission)

# Enregistre le modèle Utilisateur avec la classe d'administration personnalisée UtilisateurAdmin
admin.site.register(Utilisateur, UtilisateurAdmin)
