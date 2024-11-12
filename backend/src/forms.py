from django import forms
from allauth.account.forms import SignupForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.db.models import Max


class NewUserForm(UserCreationForm):
    email = forms.EmailField(help_text='A valid email address, please.', required=True)
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password1", "password2")

    def save(self, commit=True):
        user = super(NewUserForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.username = "user" + str(User.objects.aggregate(Max('id'))['id__max'] + 1)
        # user.first_name = self.cleaned_data["first_name"]
        # user.last_name = self.cleaned_data["last_name"]
        if commit:
            user.save()
        return user

class NewCompanyForm(UserCreationForm):
    email = forms.EmailField(help_text='A valid email address, please.', required=True)
    class Meta:
        model = User
        fields = ("first_name", "email", "password1", "password2")

    def save(self, commit=True):
        user = super(NewCompanyForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.username = "company" + str(User.objects.aggregate(Max('id'))['id__max'] + 1)
        # user.username = self.cleaned_data["username"]
        # user.first_name = self.cleaned_data["first_name"]
        # user.last_name = self.cleaned_data["last_name"]
        if commit:
            user.save()
        return user