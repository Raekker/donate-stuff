from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from donate_stuff.donation.api.views import (
    CategoryViewSet,
    DonationViewSet,
    InstitutionViewSet,
)
from donate_stuff.users.api.views import UserViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("categories", CategoryViewSet)
router.register("institutions", InstitutionViewSet)
router.register("donations", DonationViewSet)


app_name = "api"
urlpatterns = router.urls
