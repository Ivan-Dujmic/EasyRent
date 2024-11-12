from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib.auth import logout, authenticate, login
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from .forms import NewUserForm, NewCompanyForm
from .tokens import account_activation_token
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

def activate(request, uidb64, token):
	User = get_user_model()
	try:
		uid = force_str(urlsafe_base64_decode(uidb64))
		user = User.objects.get(pk=uid)
	except(TypeError, ValueError, OverflowError, User.DoesNotExist):
		user = None
	if user is not None and account_activation_token.check_token(user, token):
		user.is_active = True
		user.save()
		return redirect('src:loginUser')
	return redirect('src:home')

def activateEmail(request, user, toEmail):
    subject = "Activate EasyRent account"
    message = render_to_string('templateActivateAccount.html', {
        #'domain': get_current_site(request).domain,
        'domain': 'http://127.0.0.1:8000',
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
        'protocol': 'https' if request.is_secure() else 'http'
    })
    email = EmailMessage(subject, message, to=[toEmail])
    if email.send():
        print("Email sent!")
    else:
        print("Sending failed!")


def home(request):
    return render(
        request=request,
        template_name="home.html",
    )


def registerUser(request):
    form = NewUserForm
    if request.method == "GET":
        return render(
            request=request, template_name="register.html", context={"form": form}
        )
    elif request.method == "POST":
        registerForm = NewUserForm(request.POST)
        if registerForm.is_valid():
            user = registerForm.save(commit = False)
            user.is_active = False
            user.save()
            activateEmail(request, user, registerForm.cleaned_data.get("email"))
            # username = registerForm.cleaned_data.get("username")
            # login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            return redirect("src:home")

        else:
            registerForm.errors()
            return redirect("src:registerUser")
        
def registerCompany(request):
    form = NewCompanyForm
    if request.method == "GET":
        return render(
            request=request, template_name="register.html", context={"form": form}
        )
    elif request.method == "POST":
        registerForm = NewCompanyForm(request.POST)
        if registerForm.is_valid():
            user = registerForm.save(commit = False)
            user.is_active = False
            user.save()
            activateEmail(request, user, registerForm.cleaned_data.get("email"))
            # username = registerForm.cleaned_data.get("username")
            # login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            return redirect("src:home")

        else:
            return redirect("src:registerUser")
        

        

def logoutUser(request):
    logout(request)
    return redirect("src:home")


def loginUser(request):
    if request.method == "GET":
        loginForm = AuthenticationForm()
        return render(
            request=request, template_name="login.html", context={"form": loginForm}
        )
    elif request.method == "POST":
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("src:home")
            else:
                return redirect("src:loginUser")
        else:
            print(form.errors)
            return redirect("src:home")


def userProfile():
    return


def companyProfile():
    return


@api_view(["GET"])
def getDealershipInfo(request):
    dealership = Dealership.objects.get(id=1)
    serializer = UserViewDealershipSerializer(
        dealership, many=False
    )  # we are only returning one dealership so many = False
    if request.method == "GET":
        return Response({"dealership": serializer.data})
    return


def profile(request):
    # based on content of request redirect to user/company
    userProfile()
    companyProfile()
    return


def car(request):
    return
