from django.http.response import HttpResponse
from django.shortcuts import render

# Create your views here.
# This is request handler

def hello(request):
	return HttpResponse("Hello world!")
