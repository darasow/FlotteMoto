from django.urls import path
from .views import AdminListView, ChauffeurByUsernameView, ChauffeurLibreListView, ManagerListView, UtilisateurGenericAPIView
from django.urls import path
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', UtilisateurGenericAPIView.as_view(), name='utilisateur-liste'),
    path('username/<str:username>', ChauffeurByUsernameView.as_view(), name='chauffeur-by-username'),
    path('libre/', ChauffeurLibreListView.as_view(), name='chauffeur-libre'),
    path('managers/', ManagerListView.as_view(), name='manager-list'),
    path('admins/', AdminListView.as_view(), name='admin-list'),
    path('<int:pk>', UtilisateurGenericAPIView.as_view(), name="utilisateur-detail"),
]

