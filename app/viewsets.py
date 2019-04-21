from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Outlet, Product, Stock, Invoice
from .serializers import OutletSerializer, ProductSerializer, StockSerializer, InvoiceSerializer, InvoiceProductSerializer


class OutletViewSet(ModelViewSet):
    queryset = Outlet.objects.all()
    serializer_class = OutletSerializer


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class StockViewSet(ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

    @action(detail=False, methods=['GET'], name="Get Stock By Outlet", url_path='byoutlet/(?P<outlet_id>[0-9]+)')
    def byoutlet(self,request,*args, **kwargs):
        outlet_id = kwargs['outlet_id']
        serializer = self.get_serializer(self.queryset.filter(outlet=outlet_id), many=True)
        return Response(serializer.data)


class InvoiceViewSet(ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    @action(detail=False, methods=["GET"], name="Get Last Invoice", url_path='getLastId')
    def getLastId(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.queryset.last(), many=False)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            invoice = serializer.save()
            product_list = request.data["invoice_product_list"]

            for p in product_list:
                p["invoice"]=invoice.invoice_id
                ps = InvoiceProductSerializer(data=p)
                if ps.is_valid():
                    ps.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

