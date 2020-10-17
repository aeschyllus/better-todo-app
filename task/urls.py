"""
Task app URL configurations
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    # API Routes
    path('api/', views.api_overview, name="api-overview"),
    path('api/category-list/', views.category_list, name="category-list"),
    path('api/category-details/<int:category_id>', views.category_details, name="category-details"),
    path('api/category-tasks-list/<int:category_id>', views.task_list, name="category-task-list"),
    path('api/create-category/', views.create_category, name="create-category"),
    path('api/create-task/', views.create_task, name="create-task"),
    path('api/toggle-task/<int:task_id>', views.toggle_task, name="toggle-task"),
]
