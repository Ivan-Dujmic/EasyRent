from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
	# user = request.user
	# user_info = {
 #        'name': user.first_name or user.username,
 #        'email': user.email,
	# }
	return render(request, "home.html")

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
