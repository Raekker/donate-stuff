from rest_framework import viewsets

from donate_stuff.donation.api.filters import InstitutionFilter, DonationFilter
from donate_stuff.donation.models import Category, Donation, Institution
from donate_stuff.donation.api.serializers import (
    CategorySerializer,
    InstitutionSerializer,
    DonationSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    filterset_class = InstitutionFilter


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    filterset_class = DonationFilter
