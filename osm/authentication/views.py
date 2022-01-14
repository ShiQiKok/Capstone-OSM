from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def login(request):
    return HttpResponse("This is a login page! Welcome")

def register(request):
    return HttpResponse("This is a registration page! Welcome")