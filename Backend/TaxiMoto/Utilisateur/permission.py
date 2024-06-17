# utilisateur/permissions.py
from rest_framework import permissions
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.type_utilisateur == 'admin'

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.type_utilisateur == 'manager'

class IsChauffeur(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.type_utilisateur == 'chauffeur'

class CanCreateUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            user_data = request.data
            type_utilisateur = user_data.get('type_utilisateur', '')

            # Seuls les admins peuvent créer des admins ou des managers
            if type_utilisateur in ['admin', 'manager']:
                return request.user.type_utilisateur == 'admin'
            # Les managers peuvent créer des chauffeurs
            elif type_utilisateur == 'chauffeur':
                return request.user.type_utilisateur in ['admin', 'manager']
        return False  # Pas de création pour d'autres types d'utilisateur
