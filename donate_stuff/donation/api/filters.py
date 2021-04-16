from django_filters import rest_framework as filters

from donate_stuff.donation.models import Category, Institution, Donation


class InstitutionFilter(filters.FilterSet):
    categories = filters.ModelMultipleChoiceFilter(
        queryset=Category.objects.all(), conjoined=True
    )

    class Meta:
        model = Institution
        fields = ("categories", "type")


class DonationFilter(filters.FilterSet):
    class Meta:
        model = Donation
        fields = "__all__"
