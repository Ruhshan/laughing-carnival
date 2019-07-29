from django.contrib import admin

# Register your models here.
from app.models import Outlet, Stock, Invoice, InvoiceProduct, Product


admin.site.register(Outlet)
admin.site.register(Stock)
admin.site.register(Invoice)
admin.site.register(InvoiceProduct)
admin.site.register(Product)