# Generated by Django 5.0.6 on 2024-06-20 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Utilisateur', '0005_alter_utilisateur_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='utilisateur',
            name='telephone',
            field=models.CharField(blank=True, max_length=15, null=True, unique=True),
        ),
    ]