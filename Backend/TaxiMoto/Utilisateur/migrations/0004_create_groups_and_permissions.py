# migrations.py
from django.db import migrations
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

def create_groups_and_permissions(apps, schema_editor):
    # Créer des groupes
    admin_group, _ = Group.objects.get_or_create(name='admin')
    manager_group, _ = Group.objects.get_or_create(name='manager')
    chauffeur_group, _ = Group.objects.get_or_create(name='chauffeur')

    # Définir les modèles pour lesquels nous allons créer des permissions
    models = {
        'Moto': 'Moto',
        'Contrat': 'Contrat',
        'Panne': 'Panne',
        'Entretien': 'Entretien',
        'Recette': 'Recette',
        'Utilisateur': 'Utilisateur',
    }

    # Créer des permissions et les assigner aux groupes
    for app_name, model_name in models.items():
        content_type = ContentType.objects.get_for_model(apps.get_model(app_name, model_name))
        permissions = {
            'add': Permission.objects.get_or_create(codename=f'add_{model_name.lower()}', content_type=content_type)[0],
            'change': Permission.objects.get_or_create(codename=f'change_{model_name.lower()}', content_type=content_type)[0],
            'delete': Permission.objects.get_or_create(codename=f'delete_{model_name.lower()}', content_type=content_type)[0],
            'view': Permission.objects.get_or_create(codename=f'view_{model_name.lower()}', content_type=content_type)[0],
        }

        # CRUD pour admin
        admin_group.permissions.add(*permissions.values())

        # CRU pour manager
        manager_group.permissions.add(permissions['add'])
        manager_group.permissions.add(permissions['change'])
        manager_group.permissions.add(permissions['view'])

        # R pour chauffeur
        chauffeur_group.permissions.add(permissions['view'])

    # Permissions pour le modèle Utilisateur
    user_content_type = ContentType.objects.get_for_model(apps.get_model('Utilisateur', 'Utilisateur'))
    user_permissions = {
        'add': Permission.objects.get_or_create(codename='add_utilisateur', content_type=user_content_type)[0],
        'change': Permission.objects.get_or_create(codename='change_utilisateur', content_type=user_content_type)[0],
        'delete': Permission.objects.get_or_create(codename='delete_utilisateur', content_type=user_content_type)[0],
        'view': Permission.objects.get_or_create(codename='view_utilisateur', content_type=user_content_type)[0],
        'add_chauffeur': Permission.objects.get_or_create(codename='add_chauffeur', content_type=user_content_type, name='Can add chauffeur')[0],
        'login': Permission.objects.get_or_create(codename='login', name='Can login', content_type=user_content_type)[0],  # Correction ici pour le content_type
    }

    # CRUD pour admin
    admin_group.permissions.add(*user_permissions.values())

    # CRU pour manager, avec permission spécifique pour créer des chauffeurs
    manager_group.permissions.add(user_permissions['add'])
    manager_group.permissions.add(user_permissions['add_chauffeur'])  # Ajoute la permission pour créer des chauffeurs
    manager_group.permissions.add(user_permissions['change'])
    manager_group.permissions.add(user_permissions['view'])

    # R pour chauffeur (Voir que ses propres informations)
    chauffeur_group.permissions.add(user_permissions['view'])

def remove_groups_and_permissions(apps, schema_editor):
    Group.objects.filter(name__in=['admin', 'manager', 'chauffeur']).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('Utilisateur', '0003_utilisateur_encontrat'),  # Remplacez par la migration précédente de votre application
    ]

    operations = [
        migrations.RunPython(create_groups_and_permissions, remove_groups_and_permissions),
    ]
