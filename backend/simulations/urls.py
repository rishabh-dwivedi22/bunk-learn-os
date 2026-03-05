"""
URL configuration for the simulations app.

Routes:
    POST  save/          → SaveSimulationView
    GET   <share_slug>/  → LoadSimulationView
"""

from django.urls import path

from . import views

app_name = "simulations"

urlpatterns = [
    path("save/", views.SaveSimulationView.as_view(), name="save"),
    path(
        "<slug:share_slug>/",
        views.LoadSimulationView.as_view(),
        name="load",
    ),
]
