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

# Formulaire de création de nouveaux utilisateurs
class UtilisateurCreationForm(forms.ModelForm):
    """
    Formulaire pour créer de nouveaux utilisateurs. Ce formulaire inclut les champs nécessaires
    et permet la sélection du type d'utilisateur.
    """
    class Meta:
        # Modèle lié à ce formulaire
        model = Utilisateur
        # Champs inclus dans le formulaire
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'type_utilisateur')


# Classe d'administration personnalisée pour le modèle Utilisateur
class UtilisateurAdmin(BaseUserAdmin):
    """
    Classe d'administration pour le modèle Utilisateur. Configure les formulaires,
    les champs affichés et la logique d'enregistrement.
    """
    # Utilise UtilisateurCreationForm comme formulaire de création
    add_form = UtilisateurCreationForm

    # Définition des champs affichés dans le formulaire d'ajout dans l'admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'type_utilisateur', 'is_active', 'is_staff')}
        ),
    )

    # Configuration des champs affichés dans le formulaire d'administration
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'type_utilisateur')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fonction pour personnaliser le formulaire en fonction de l'utilisateur connecté
    def get_form(self, request, obj=None, **kwargs):
        """
        Retourne le formulaire d'administration à utiliser pour ce modèle.
        Permet de restreindre les choix de type d'utilisateur pour les managers.
        """
        form = super().get_form(request, obj, **kwargs)
        if request.user.groups.filter(name='manager').exists():
            # Restreint les choix de type_utilisateur pour les managers
            form.base_fields['type_utilisateur'].choices = [('chauffeur', 'Chauffeur')]
        return form

    # Fonction pour personnaliser la logique de sauvegarde de l'objet
    def save_model(self, request, obj, form, change):
        """
        Enregistre le modèle dans la base de données. Si un manager crée un utilisateur,
        force le type d'utilisateur à être 'chauffeur'.
        """
        if not change and request.user.groups.filter(name='manager').exists():
            # Les managers ne peuvent créer que des utilisateurs de type 'chauffeur'
            obj.type_utilisateur = 'chauffeur'
        super().save_model(request, obj, form, change)

# Enregistrement des modèles dans l'interface d'administration
# Cela permet de gérer ces modèles via l'interface admin de Django

# Enregistre le modèle Moto
admin.site.register(Moto)

# Enregistre le modèle Contrat
admin.site.register(Contrat)

# Enregistre le modèle Panne
admin.site.register(Panne)

# Enregistre le modèle Entretien
admin.site.register(Entretien)

# Enregistre le modèle Recette
admin.site.register(Recette)

# Enregistre également les permissions pour ces modèles
admin.site.register(Permission)

# Enregistre le modèle Utilisateur avec la classe d'administration personnalisée UtilisateurAdmin
admin.site.register(Utilisateur, UtilisateurAdmin)
