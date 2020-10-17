from django.contrib import admin
from .models import Category, Task

class CategoryAdmin(admin.ModelAdmin):
    """
    Display settings of the Category model in Admin interface
    """
    list_display = ("id", "name")


class TaskAdmin(admin.ModelAdmin):
    """
    Display settings of the Task model in Admin interface
    """
    list_display = ("id", "name", "is_done")

admin.site.register(Category, CategoryAdmin)
admin.site.register(Task, TaskAdmin)
