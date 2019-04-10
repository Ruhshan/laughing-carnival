from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Outlet, Product, Stock


class OutletSerializer(ModelSerializer):
    class Meta:
        model = Outlet
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class StockSerializer(ModelSerializer):
    product_number = ProductSerializer()
    class Meta:
        model = Stock
        fields = '__all__'
