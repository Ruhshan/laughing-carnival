from django.urls import path
from .views import PageView
from rest_framework import routers
from .viewsets import OutletViewSet, ProductViewSet, StockViewSet

urlpatterns = [
    path('', PageView.as_view()),

]
router = routers.SimpleRouter()

router.register('outlet', OutletViewSet)
router.register('product', ProductViewSet)
router.register('stock', StockViewSet)
