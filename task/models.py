"""
App models
"""
from django.db import models

class Category(models.Model):
    """
    Category model
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Task(models.Model):
    """
    Task model
    """
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="tasks")
    name = models.CharField(max_length=100)
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return self.name
