# urls.py
"""
URL configuration for TaxiMoto project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from Utilisateur.views import  MyTokenObtainPairView, RegisterView



urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('admin/', admin.site.urls),
    path('contrat/', include('Contrat.urls')),
    path('entretien/', include('Entretien.urls')),
    path('moto/', include('Moto.urls')),
    path('panne/', include('Panne.urls')),
    path('recette/', include('Recette.urls')),
    path('utilisateur/', include('Utilisateur.urls')),
    
]

