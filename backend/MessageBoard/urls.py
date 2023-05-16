from django.urls import path
from . import views

urlpatterns = [
    path('posts', views.handle_post, name='handle_posts'),
]