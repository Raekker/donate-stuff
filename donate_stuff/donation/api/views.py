from rest_framework import viewsets

from donate_stuff.donation.api.serializers import CategorySerializer
from donate_stuff.donation.models import Category


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
