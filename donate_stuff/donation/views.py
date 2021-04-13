from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views import View

from donate_stuff.donation.models import Donation, Institution


class MainPageView(View):
    def get(self, request):
        ctx = {}
        bags = sum([x.quantity for x in Donation.objects.all()])
        organizations = set()
        for org in Donation.objects.all():
            organizations.add(org.institution)
        organizations = len(organizations)
        charities = Institution.objects.filter(type=1)
        gov_orgs = Institution.objects.filter(type=2)
        local_collections = Institution.objects.filter(type=3)
        ctx["bags"] = bags
        ctx["organizations"] = organizations
        ctx["charities"] = charities
        ctx["gov_orgs"] = gov_orgs
        ctx["local_collections"] = local_collections
        return render(request, "pages/home.html", ctx)


class DonationView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, "donation/donation_form.html")


class DonationConfirmationView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, "donation/donation_form_confirmation.html")


class DonationsView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, "users/user_donations.html")
