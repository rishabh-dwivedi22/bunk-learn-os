"""
Models for the simulations app.

Defines the core SimulationScenario model that stores CPU/Memory/Disk
scheduling scenarios as shareable, JSON-backed records.
"""

import uuid

from django.db import models


class SimulationScenario(models.Model):
    """A saved simulation scenario that can be shared via a unique slug."""

    MODULE_CHOICES = [
        ("CPU", "CPU Scheduling"),
        ("MEMORY", "Memory Management"),
        ("DISK", "Disk Scheduling"),
    ]

    title = models.CharField(
        max_length=200,
        help_text="Human-readable title, e.g. 'Hard Midterm Question 2'.",
    )

    module_type = models.CharField(
        max_length=10,
        choices=MODULE_CHOICES,
        help_text="OS module category for this scenario.",
    )

    algorithm_used = models.CharField(
        max_length=100,
        help_text="Algorithm name, e.g. 'FCFS', 'SJF', 'LRU'.",
    )

    input_data = models.JSONField(
        help_text=(
            "Flexible JSON payload storing process definitions, "
            "burst times, memory requests, etc."
        ),
    )

    created_at = models.DateTimeField(auto_now_add=True)

    share_slug = models.SlugField(
        max_length=12,
        unique=True,
        editable=False,
        help_text="Auto-generated short slug for sharing.",
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Simulation Scenario"
        verbose_name_plural = "Simulation Scenarios"

    def __str__(self) -> str:
        return f"{self.title} ({self.algorithm_used})"

    def save(self, *args, **kwargs):
        """Generate a unique share_slug on first save."""
        if not self.share_slug:
            self.share_slug = uuid.uuid4().hex[:8]
        super().save(*args, **kwargs)
