from django.contrib.auth import forms as admin_forms
from django.contrib.auth import get_user_model
from django import forms
from django.utils.translation import gettext_lazy as _

from allauth.account.forms import SignupForm

User = get_user_model()


class UserChangeForm(admin_forms.UserChangeForm):
    class Meta(admin_forms.UserChangeForm.Meta):
        model = User


class UserCreationForm(admin_forms.UserCreationForm):
    class Meta(admin_forms.UserCreationForm.Meta):
        model = User

        error_messages = {
            "username": {"unique": _("This username has already been taken.")}
        }


class UserSignUpForm(SignupForm):
    first_name = forms.CharField(max_length=255)
    last_name = forms.CharField(max_length=255)

    def save(self, request):
        user = super(UserSignUpForm, self).save(request)
        user.first_name = request.POST["first_name"]
        user.last_name = request.POST["last_name"]

        return user
