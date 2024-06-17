from django.urls import path
from .views import ChauffeurGenericAPIView

urlpatterns = [
    path('', ChauffeurGenericAPIView.as_view(), name="chauffeur-list"),
    path('<int:pk>', ChauffeurGenericAPIView.as_view(), name="chauffeur-detail"),
]