from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
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

@api_view(['GET'])
def getDealershipInfo(request):
	dealership = Dealership.objects.get(id = 1)
	serializer = UserViewDealershipSerializer(dealership, many = False) #we are only returning one dealership so many = False
	if request.method == "GET":
		return Response({"dealership" : serializer.data})
	return		


def profile(request):
	# based on content of request redirect to user/company
	userProfile()
	companyProfile()
	return

def car(request):
	return
