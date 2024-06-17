# Contrat/apps.py
from django.apps import AppConfig

class ContratConfig(AppConfig):
    name = 'Contrat'

    def ready(self):
        import Contrat.signals
