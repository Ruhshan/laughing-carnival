from django.contrib import admin

# Register your models here.
from app.models import Outlet, Stock


admin.site.register(Outlet)
admin.site.register(Stock)