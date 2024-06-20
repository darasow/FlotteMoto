# myapp/models.py

# Importation des modèles et classes nécessaires de Django
from django.contrib.auth.models import AbstractBaseUser, AbstractUser, Permission, Group, PermissionsMixin
from django.db import models

# Importation du gestionnaire personnalisé pour les utilisateurs
from .managers import UtilisateurManager

# Définition du modèle Utilisateur
class Utilisateur(AbstractUser, PermissionsMixin):
    """
    Modèle personnalisé d'utilisateur, hérite de AbstractUser et PermissionsMixin.
    Ajoute des champs et fonctionnalités supplémentaires par rapport à l'utilisateur standard de Django.
    """

    # Types possibles pour le type d'utilisateur
    TYPES_UTILISATEUR = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('chauffeur', 'Chauffeur'),
    )

    # Champ pour le type d'utilisateur, avec des choix définis
    type_utilisateur = models.CharField(max_length=10, choices=TYPES_UTILISATEUR)

    # Champ pour le téléphone de l'utilisateur, optionnel
    telephone = models.CharField(max_length=15, null=True, blank=True, unique=True)

    # Champ pour l'adresse de l'utilisateur, optionnel
    adresse = models.TextField(null=True, blank=True)

    # Date d'embauche, auto-remplie à la date de création
    date_embauche = models.DateField(auto_now_add=True, blank=True)

    # Indique si l'utilisateur est sous contrat
    enContrat = models.BooleanField(default=False)

    # Champ email, unique et obligatoire
    email = models.EmailField(unique=True, null=False)

    # Redéfinition des relations avec les groupes et les permissions
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",  # Permet de définir une relation inversée personnalisée
        blank=True,
        help_text=("The groups this user belongs to."),  # Texte d'aide pour le champ
        verbose_name=("groups"),  # Nom d'affichage dans l'admin
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",  # Permet de définir une relation inversée personnalisée
        blank=True,
        help_text=("Specific permissions for this user."),  # Texte d'aide pour le champ
        verbose_name=("user permissions"),  # Nom d'affichage dans l'admin
    )

    # Utilisation du gestionnaire personnalisé pour les utilisateurs
    objects = UtilisateurManager()

    USERNAME_FIELD = 'username'
    # Surcharge de la méthode save pour ajouter de la logique spécifique
    def save(self, *args, **kwargs):
        """
        Surcharge de la méthode save pour définir les drapeaux d'administrateur, de staff, et d'activation
        en fonction du type d'utilisateur.
        """
        # Si l'utilisateur est de type 'admin', il est superutilisateur, membre du staff et actif
        if self.type_utilisateur == 'admin':
            self.is_superuser = True
            self.is_staff = True
            self.is_active = True
        else:
            # Tous les autres types d'utilisateur sont actifs par défaut
            self.is_active = True
        super().save(*args, **kwargs)
    
    # Méthode pour retourner le nom d'utilisateur comme représentation de l'objet
    def __str__(self):
        return self.username

