# Create your models here.
from datetime import timezone
from django.db import models
from django.conf import settings

class Moto(models.Model):
    numero_serie = models.CharField(max_length=50, unique=True)
    couleur = models.CharField(max_length=50)
    date_achat = models.DateField()
    enContrat = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="moto_created_by", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now=True)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="moto_modified_by", on_delete=models.SET_NULL, null=True)
    def __str__(self):
        return self.numero_serie