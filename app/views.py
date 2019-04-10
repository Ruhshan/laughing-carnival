from django.shortcuts import render

# Create your views here.

from django.views.generic import TemplateView


class PageView(TemplateView):
    template_name = "app/index.html"


class InvoiceView(TemplateView):
    template_name = "app/Invoice.html"