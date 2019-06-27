from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    # TemplateView renders index.html (where react app dwells)
    path('', TemplateView.as_view(template_name='posts/index.html')),
    path('api/posts/', include('posts.urls')),
    path('api/accounts/', include('accounts.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
