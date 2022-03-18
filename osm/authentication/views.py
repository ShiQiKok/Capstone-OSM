# Create your views here.
from django.http import HttpResponse
from django.shortcuts import redirect

def index(request):
    # redirect the index page to login
    response  = redirect('login/')
    return response

def login(request):
    return HttpResponse("This is a login page! Welcome")

def register(request):
    return HttpResponse("This is a registration page! Welcome")