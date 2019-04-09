# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Invoice(models.Model):
    invoice_id = models.BigAutoField(db_column='INVOICE_ID', primary_key=True)  # Field name made lowercase.
    invoice_date = models.DateTimeField(db_column='INVOICE_DATE', blank=True, null=True)  # Field name made lowercase.
    outlet = models.ForeignKey('Outlet', models.DO_NOTHING, db_column='OUTLET_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'invoice'


class InvoiceProduct(models.Model):
    id = models.BigAutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    invoice = models.ForeignKey(Invoice, models.DO_NOTHING, db_column='INVOICE_ID', blank=True, null=True)  # Field name made lowercase.
    quantity = models.BigIntegerField(db_column='QUANTITY', blank=True, null=True)  # Field name made lowercase.
    product_number = models.ForeignKey('Product', models.DO_NOTHING, db_column='PRODUCT_NUMBER', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'invoice_product'


class Outlet(models.Model):
    outlet_id = models.BigAutoField(db_column='OUTLET_ID', primary_key=True)  # Field name made lowercase.
    outlet_name = models.CharField(db_column='OUTLET_NAME', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='isDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        managed = False
        db_table = 'outlet'


class Product(models.Model):
    product_number = models.CharField(db_column='PRODUCT_NUMBER', primary_key=True, max_length=255)  # Field name made lowercase.
    price = models.FloatField(db_column='PRICE', blank=True, null=True)  # Field name made lowercase.
    product_name = models.CharField(db_column='PRODUCT_NAME', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='isDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        managed = False
        db_table = 'product'


class Stock(models.Model):
    id = models.BigAutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    quantity = models.BigIntegerField(db_column='QUANTITY', blank=True, null=True)  # Field name made lowercase.
    outlet = models.ForeignKey(Outlet, models.DO_NOTHING, db_column='OUTLET_ID', blank=True, null=True)  # Field name made lowercase.
    product_number = models.ForeignKey(Product, models.DO_NOTHING, db_column='PRODUCT_NUMBER', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'stock'
