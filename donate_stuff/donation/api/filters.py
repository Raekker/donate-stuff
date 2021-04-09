from django_filters import rest_framework as filters

from donate_stuff.donation.models import Category, Institution


class InstitutionFilter(filters.FilterSet):
    categories = filters.ModelMultipleChoiceFilter(
        queryset=Category.objects.all(), conjoined=True
    )

    class Meta:
        model = Institution
        fields = ("categories", "type")
