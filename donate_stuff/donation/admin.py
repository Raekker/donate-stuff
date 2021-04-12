from django.contrib import admin

from donate_stuff.donation.models import Category, Institution, Donation


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    model = Category


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):

    model = Institution


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):

    model = Donation
