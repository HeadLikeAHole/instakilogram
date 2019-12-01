from .settings import *


# https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

DEBUG = False

ALLOWED_HOSTS = ['.pythonanywhere.com']

# postgresql database doesn't work on pythonanywhere with a free account
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# https://docs.djangoproject.com/en/2.2/ref/settings/
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_PRELOAD = True
