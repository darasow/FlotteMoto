from django.db import models

from Utilisateur.models import Utilisateur

# Create your models here.
class Role(models.Model):
    CHOICES = (
        (1, 'Admin'),
        (2, 'Chauffeur'),
        (3, 'Manager')
    )
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    authorization_level = models.IntegerField(choices=CHOICES) 
    created_by = models.ForeignKey(Utilisateur, on_delete=models.DO_NOTHING, related_name='roles_created', blank=True,
                                   null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.DO_NOTHING, related_name='roles_modified', null=True,
                                    blank=True)
    modified_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    status = models.IntegerField(default=1)