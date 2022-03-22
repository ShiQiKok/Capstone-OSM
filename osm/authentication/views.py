# Create your views here.
from django.http import HttpResponse
from django.shortcuts import redirect, render

def index(request):
    # redirect the index page to login
    response  = redirect('login/')
    return response

def login(request):
    context = {
        "heading": "This is a login page!"
    }
    return render(request, 'login.html', context)

def register(request):
    return HttpResponse("This is a registration page! Welcome")