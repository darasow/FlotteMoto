from django.urls import path
from .views import PanneGenericAPIView, PannesParChauffeurEnContratAPIView
urlpatterns = [
    path('', PanneGenericAPIView.as_view(), name="panne-list"),
    path('chauffeur/<int:chauffeur_id>/', PannesParChauffeurEnContratAPIView.as_view(), name='pannes-chauffeur-en-contrat'),
    path('<int:pk>', PanneGenericAPIView.as_view(), name="panne-detail"),
]