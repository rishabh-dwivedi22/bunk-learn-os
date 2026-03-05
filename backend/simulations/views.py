"""
API views for the simulations app.

Provides two endpoints:
- POST /api/simulations/save/   → Create a new scenario.
- GET  /api/simulations/<slug>/ → Retrieve a scenario by its share slug.
"""

from rest_framework import generics, status
from rest_framework.response import Response

from .models import SimulationScenario
from .serializers import SimulationScenarioSerializer


class SaveSimulationView(generics.CreateAPIView):
    """
    POST /api/simulations/save/

    Accept a JSON payload from the React frontend
    and persist it as a new SimulationScenario.

    Returns the full serialized object (including the
    auto-generated ``share_slug``) with HTTP 201.
    """

    serializer_class = SimulationScenarioSerializer

    def create(self, request, *args, **kwargs):
        """Override to return the newly-created object with 201."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoadSimulationView(generics.RetrieveAPIView):
    """
    GET /api/simulations/<share_slug>/

    Fetch a specific SimulationScenario by its unique share slug
    so the React frontend can reconstruct the saved state.
    """

    serializer_class = SimulationScenarioSerializer
    queryset = SimulationScenario.objects.all()
    lookup_field = "share_slug"
