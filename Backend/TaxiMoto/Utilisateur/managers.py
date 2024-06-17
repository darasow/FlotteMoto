# models.py
from django.contrib.auth.models import BaseUserManager

class UtilisateurManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not email:
            raise ValueError('Le champ Email doit être renseigné')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('type_utilisateur', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superutilisateur doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superutilisateur doit avoir is_superuser=True.')
        if extra_fields.get('type_utilisateur') != 'admin':
            raise ValueError('Le superutilisateur doit avoir type_utilisateur="admin".')

        return self.create_user(username, email, password, **extra_fields)
    
    def create_chauffeur(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('type_utilisateur', 'chauffeur')
        return self.create_user(username, email, password, **extra_fields)
