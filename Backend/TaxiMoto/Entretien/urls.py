from django.urls import path
from .views import EntretienGenericAPIView, EntretienParChauffeurEnContratAPIView

urlpatterns = [
    path('', EntretienGenericAPIView.as_view(), name="entretien-list"),
    path('chauffeur/<int:chauffeur_id>/', EntretienParChauffeurEnContratAPIView.as_view(), name='pannes-chauffeur-en-contrat'),
    path('<int:pk>', EntretienGenericAPIView.as_view(), name="entretien-detail"),
]