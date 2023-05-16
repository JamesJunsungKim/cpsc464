from django.views.generic import ListView
from .models import Post
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseBadRequest
import json
from django.utils import timezone
from .models import *
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def handle_post(request):
    method = request.method

    if method == "GET":
        result = []
        posts = Post.objects.all().order_by('-created_at')
        for post in posts:
            result.append({
                "id": post.id,
                "text": post.text_content,
                "created_at": post.created_at
            })

        return JsonResponse({
            "posts": result,
        })

    elif method == "POST":
        body = json.loads(request.body)
        text = body.get("text")
        if not text:
            return HttpResponseBadRequest()

        new = Post.objects.create(text_content=text)
        new.save()

        return JsonResponse({
            "id": new.id,
            "text": new.text_content,
            "created_at": new.created_at
        })

    else:
        return HttpResponseBadRequest()
