from django.urls import path
from .views import MotoEnContratEmbaucheAPIView, MotoGenericAPIView, MotoNonContratAPIView

urlpatterns = [
    path('', MotoGenericAPIView.as_view(), name="moto-list"),
    path('libre/', MotoNonContratAPIView.as_view(), name='moto-libre'),
    path('enContrat/embauche/', MotoEnContratEmbaucheAPIView.as_view(), name='moto-en-contrat-embauche'),
    path('<int:pk>', MotoGenericAPIView.as_view(), name="moto-detail"),
]