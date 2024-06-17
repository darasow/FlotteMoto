# Create your models here.
from django.db import models
from django.conf import settings

from Moto.models import Moto

class Panne(models.Model):
    ETAT_PANNE = (
        ('non_corrigee', 'Non corrigée'),
        ('corrigee', 'Corrigée'),
    )

    moto = models.ForeignKey(Moto, on_delete=models.CASCADE)
    description = models.TextField()
    date_signalement = models.DateField()
    etat = models.CharField(max_length=12, choices=ETAT_PANNE, default='non_corrigee')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="panne_created_by", on_delete=models.SET_NULL, null=True)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="panne_modified_by", on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Panne ({self.moto.numero_serie}) {self.date_signalement}"
