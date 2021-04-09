from rest_framework import viewsets

from donate_stuff.donation.models import Category
from donate_stuff.donation.api.serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
