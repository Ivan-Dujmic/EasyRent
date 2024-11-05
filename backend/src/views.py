from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
# This is request handler

def mainPage(request):
    return HttpResponse("Renting made easy with EasyRent!")
def userRegister():
	return

def companyRegister():
	return

def userProfile():
	return

def companyProfile():
	return

def login(request):
	return

def register(request):
	# based on content of request redirect to user/company
	userRegister()
	companyRegister()
	return


def profile(request):
	# based on content of request redirect to user/company
	userProfile()
	companyProfile()
	return

def car(request):
	return
