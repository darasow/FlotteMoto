from django.urls import path

from Recette.views import RecetteChauffeurAPIView, RecetteGenericAPIView

urlpatterns = [
    path('', RecetteGenericAPIView.as_view(), name="recette-list"),
     path('chauffeur/<int:user_id>/', RecetteChauffeurAPIView.as_view(), name='recettes-chauffeur'),
    path('<int:pk>', RecetteGenericAPIView.as_view(), name="recette-detail"),
]