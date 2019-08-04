from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from weasyprint import HTML, CSS
from django.shortcuts import render
from django.db.models import F, ExpressionWrapper, FloatField, Sum
from django.template.loader import get_template
from django.conf import settings

from .models import Invoice
# Create your views here.

from django.views.generic import TemplateView

@method_decorator(login_required, name='dispatch')
class PageView(TemplateView):
    template_name = "app/index.html"

@method_decorator(login_required, name='dispatch')
class InvoiceView(TemplateView):
    template_name = "app/Invoice.html"

@method_decorator(login_required, name='dispatch')
class ProductView(TemplateView):
    template_name = "app/product.html"

@method_decorator(login_required, name='dispatch')
class OutletView(TemplateView):
    template_name = "app/outlet.html"

@method_decorator(login_required, name='dispatch')
class AutoInvoiceView(TemplateView):
    template_name = "app/auto_invoice.html"

@login_required
def InvoicePdfView(request,invoice_id):
    if request.method=="GET":
        invoice = Invoice.objects.get(invoice_id=invoice_id)
        products = invoice.invoiceproduct_set.annotate(amount=ExpressionWrapper(F("quantity")*F("product_number__price"),output_field=FloatField())).all()
        products = products.order_by("product_number")
        total_quantity = products.aggregate(Sum('quantity'))["quantity__sum"]
        total_amount = products.aggregate(Sum('amount'))["amount__sum"]

        html_template = get_template('app/_invoice_pdf.html').render(
            {'invoice':invoice, 'products':products,"total_quantity":total_quantity,"total_amount":total_amount},
            request)
        pdf_file = HTML(string=html_template, base_url=request.build_absolute_uri()).write_pdf()
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'filename="home_page.pdf"'

        return response

