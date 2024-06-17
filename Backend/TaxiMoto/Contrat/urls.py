from django.urls import path
from .views import ContratGenericAPIView, ContratsEnCoursAPIView

urlpatterns = [
    path('en_cours/', ContratsEnCoursAPIView.as_view(), name='contrats-en-cours'),
    path('', ContratGenericAPIView.as_view(), name="contrat-list"),
    path('<int:pk>', ContratGenericAPIView.as_view(), name="contrat-detail"),
]