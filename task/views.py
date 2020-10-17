"""
API functions
"""
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer

def index(request):
    """
    Default route of the app
    """
    return render(request, 'task/index.html')


@api_view(['GET'])
def api_overview(request):
    """
    Show available API URLs
    """
    api_urls = {
        'Categories': '/category-list/',
        'Category Details': '/category-details/<int:category_id>',
        'Category Tasks': '/category-tasks-list/<int:category_id>',
        'Create Category': '/create-category/',
        'Create Task': '/create-task/',
        'Toggle Task': '/toggle-task/<int:task_id>',
    }
    return Response(api_urls)


@api_view(['GET'])
def category_list(request):
    """
    Show all categories
    """
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def category_details(request, category_id):
    """
    Get the details of a category
    """
    category = Category.objects.get(id=category_id)
    serializer = CategorySerializer(category, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def create_category(request):
    """
    Create a category
    """
    serializer = CategorySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['GET'])
def task_list(request, category_id):
    """
    Show all tasks of a category
    """
    category = Category.objects.get(id=category_id)
    tasks = category.tasks
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_task(request):
    """
    Create a task
    """
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
def toggle_task(request, task_id):
    """
    Toggle the task as complete/incomplete
    """
    task = Task.objects.get(id=task_id)
    serializer = TaskSerializer(task, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)
