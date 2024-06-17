# Contrat/signals.py
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import Contrat

@receiver(pre_delete, sender=Contrat)
def update_chauffeur_and_moto_before_delete(sender, instance, **kwargs):
    # Mettre à jour le champ `enContrat` pour le chauffeur
    if instance.chauffeur:
        instance.chauffeur.enContrat = False
        instance.chauffeur.save()

    # Mettre à jour le champ `enContrat` pour la moto
    if instance.moto:
        instance.moto.enContrat = False
        instance.moto.save()
