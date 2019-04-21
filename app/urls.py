from django.urls import path
from .views import PageView, InvoiceView
from rest_framework import routers
from .viewsets import OutletViewSet, ProductViewSet, StockViewSet, InvoiceViewSet

urlpatterns = [
    path('', PageView.as_view()),
    path('invoice',InvoiceView.as_view(), name='invoice-view')

]
router = routers.SimpleRouter()

router.register('outlet', OutletViewSet)
router.register('product', ProductViewSet)
router.register('stock', StockViewSet)
router.register('invoice', InvoiceViewSet)