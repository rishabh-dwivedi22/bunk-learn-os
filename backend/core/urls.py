"""
URL configuration for core project.

Routes:
    /admin/               → Django admin
    /api/simulations/     → simulations app endpoints
"""

from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Welcome to Bunk & Learn OS API",
        "endpoints": {
            "save_simulation": "/api/simulations/save/",
            "load_simulation": "/api/simulations/<slug>/"
        }
    })

urlpatterns = [
    path("", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    path("api/simulations/", include("simulations.urls")),
]
