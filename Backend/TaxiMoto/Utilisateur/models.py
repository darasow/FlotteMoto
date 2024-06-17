# myapp/models.py

from django.contrib.auth.models import AbstractBaseUser, AbstractUser, Permission, Group, PermissionsMixin
from django.db import models

from .managers import UtilisateurManager  # Importation du gestionnaire
from rest_framework_simplejwt.tokens import RefreshToken
class Utilisateur(AbstractUser, PermissionsMixin):
    TYPES_UTILISATEUR = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('chauffeur', 'Chauffeur'),
    )
    type_utilisateur = models.CharField(max_length=10, choices=TYPES_UTILISATEUR)
    telephone = models.CharField(max_length=15, null=True, blank=True)
    adresse = models.TextField(null=True, blank=True)
    date_embauche = models.DateField(auto_now_add=True, blank=True)
    enContrat = models.BooleanField(default=False)
    
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",
        blank=True,
        help_text=("The groups this user belongs to."),
        verbose_name=("groups"),
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",
        blank=True,
        help_text=("Specific permissions for this user."),
        verbose_name=("user permissions"),
    )

    objects = UtilisateurManager()  # Utilisation du gestionnaire personnalisé

    def save(self, *args, **kwargs):
        if self.type_utilisateur == 'admin':
            self.is_superuser = True
            self.is_staff = True
            self.is_active = True
        else:
            self.is_active = True
        super().save(*args, **kwargs)
    
    

    def __str__(self):
        return self.username
    
    