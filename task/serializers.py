"""
Serializers for models
"""
from rest_framework import serializers
from .models import Category, Task

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model
    """
    class Meta:
        model = Category
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task model
    """
    class Meta:
        model = Task
        fields = '__all__'
