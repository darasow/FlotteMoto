# models.py
from django.contrib.auth.models import BaseUserManager, Group, Permission

class UtilisateurManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not email:
            raise ValueError('Le champ Email doit être renseigné')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)

        # Ajouter l'utilisateur au groupe "admin" si c'est un admin
        if user.type_utilisateur == 'admin':
            self.add_user_to_admin_group(user)
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

        user = self.create_user(username, email, password, **extra_fields)

        # Ajouter le superutilisateur au groupe "admin" et attribuer les permissions
        self.add_user_to_admin_group(user)

        return user
    
    def create_chauffeur(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('type_utilisateur', 'chauffeur')
        return self.create_user(username, email, password, **extra_fields)

    def add_user_to_admin_group(self, user):
        """
        Ajoute un utilisateur au groupe "admin" et attribue toutes les permissions d'un admin.
        """
        # Vérifiez ou créez le groupe "admin"
        admin_group, created = Group.objects.get_or_create(name='admin')

        if created:
            # Si le groupe est nouvellement créé, attribuez toutes les permissions au groupe
            admin_permissions = Permission.objects.all()
            admin_group.permissions.set(admin_permissions)

        # Ajoutez l'utilisateur au groupe "admin"
        user.groups.add(admin_group)

        # Donnez toutes les permissions au superutilisateur directement
        user.user_permissions.set(Permission.objects.all())
