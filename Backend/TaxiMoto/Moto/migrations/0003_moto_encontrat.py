# Generated by Django 5.0.6 on 2024-06-10 01:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Moto', '0002_remove_moto_chauffeur_moto_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='moto',
            name='enContrat',
            field=models.BooleanField(default=False),
        ),
    ]