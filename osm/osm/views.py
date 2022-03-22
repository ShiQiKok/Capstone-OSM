from django.shortcuts import redirect, render

def index(request, path=''):
    response  = redirect('api/')
    return response