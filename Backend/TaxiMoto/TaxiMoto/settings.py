"""
Django settings for TaxiMoto project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-6nk$z(_a1z=v5^^9fyk6-_+31vci=tedj@5)y73h)g4e@!@yjb'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]
CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "DELETE",
    "PATCH",
    "PUT",
]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
# Application definition
APPEND_SLASH=False

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'Chauffeur',
    'Contrat',
    'Entretien',
    'Moto',
    'Panne',
    'Recette',
    'Utilisateur',
    "Role",
    'rest_framework',
    'rest_framework_simplejwt',
    "corsheaders",
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware', # 
    'django.middleware.common.CommonMiddleware', # 

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'TaxiMoto.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'TaxiMoto.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'FlotteMoto',
        'HOST' : "127.0.0.1",
        'USER' : 'root',
        'PASSWORD' : '',
        'PORT' : 3306
    }
}
AUTH_USER_MODEL = "Utilisateur.Utilisateur"

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# Configuration SIMPLE_JWT pour Django REST Framework
SIMPLE_JWT = {
    # Durée de vie du jeton d'accès avant qu'il expire. Ici, il est valable 10 minutes.
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    
    # Durée de vie du jeton de rafraîchissement avant qu'il expire. Ici, il est valable 1 jour.
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    
    # Durée de vie d'un jeton glissant (sliding token) avant qu'il expire. Utilisé pour le rafraîchissement silencieux. Ici, il est valable 5 minutes.
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    
    # Durée de vie maximale pendant laquelle un jeton glissant peut être rafraîchi. Ici, il est valable 1 jour.
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    
    # Indique si les jetons de rafraîchissement doivent être remplacés par de nouveaux après utilisation.
    'ROTATE_REFRESH_TOKENS': True,
    
    # Indique si les anciens jetons de rafraîchissement doivent être mis en liste noire après rotation.
    'BLACKLIST_AFTER_ROTATION': True,
    
    # Indique si le champ `last_login` de l'utilisateur doit être mis à jour à chaque connexion.
    'UPDATE_LAST_LOGIN': False,
    
    # Algorithme utilisé pour signer le jeton. HS256 (HMAC with SHA-256) est utilisé ici.
    'ALGORITHM': 'HS256',
    
    # Clé de signature pour les jetons. `SECRET_KEY` de Django est utilisé ici.
    'SIGNING_KEY': SECRET_KEY,
    
    # Clé de vérification pour les jetons. None signifie que la clé de vérification n'est pas utilisée.
    'VERIFYING_KEY': None,
    
    # Auditoire pour lequel le jeton est destiné. None signifie que cela n'est pas utilisé.
    'AUDIENCE': None,
    
    # Émetteur du jeton. None signifie que cela n'est pas utilisé.
    'ISSUER': None,
    
    # Encodeur JSON utilisé pour les jetons. None signifie que l'encodeur par défaut est utilisé.
    'JSON_ENCODER': None,
    
    # URL pour obtenir les clés JSON Web (JWK) pour la vérification. None signifie que cela n'est pas utilisé.
    'JWK_URL': None,
    
    # Tolérance pour le traitement de la différence de temps entre les serveurs. 0 signifie qu'il n'y a pas de tolérance.
    'LEEWAY': 0,
    
    # Types d'en-tête d'autorisation acceptés. Ici, seuls les jetons commençant par 'Bearer' sont acceptés.
    'AUTH_HEADER_TYPES': ('Bearer',),
    
    # Nom de l'en-tête HTTP à utiliser pour l'autorisation. Utilisé pour chercher le jeton dans les requêtes.
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    
    # Champ de l'utilisateur à utiliser pour l'identification dans le jeton. Ici, c'est le champ `id`.
    'USER_ID_FIELD': 'id',
    
    # Nom de la réclamation dans le jeton pour l'identification de l'utilisateur. Ici, c'est `user_id`.
    'USER_ID_CLAIM': 'user_id',
    
    # Règle d'authentification pour l'utilisateur par défaut. Utilise une méthode de règle par défaut fournie par `rest_framework_simplejwt`.
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    
    # Classes de jetons autorisées. Utilise la classe `AccessToken` pour les jetons d'accès.
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    
    # Nom de la réclamation dans le jeton pour indiquer le type de jeton. Ici, c'est `token_type`.
    'TOKEN_TYPE_CLAIM': 'token_type',
    
    # Nom de la réclamation dans le jeton pour l'identifiant unique du jeton (JWT ID).
    'JTI_CLAIM': 'jti',
    
    # Nom de la réclamation pour l'expiration du jeton glissant. Utilisé pour indiquer quand le jeton glissant peut être rafraîchi.
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
}
