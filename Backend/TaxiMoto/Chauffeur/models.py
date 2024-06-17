from django.db import models
from django.conf import settings


class Chauffeur(models.Model):
    utilisateur = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    contrat_type = models.CharField(max_length=10, choices=[('credit', 'Crédit'), ('embauche', 'Embauche')])
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="chauffeur_created_by", on_delete=models.SET_NULL, null=True)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="chauffeur_modified_by", on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.utilisateur.first_name} {self.utilisateur.last_name}"
