from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Outlet, Product, Stock
from .serializers import OutletSerializer, ProductSerializer, StockSerializer


class OutletViewSet(ModelViewSet):
    queryset = Outlet.objects.all()
    serializer_class = OutletSerializer


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class StockViewSet(ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

    @action(detail=False, methods=['GET'], name="Get Stock By Outlet", url_path='byoutlet/(?P<year>[0-9])')
    def byoutlet(self,request,*args, **kwargs):
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)