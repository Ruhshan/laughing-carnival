from django.urls import path
from .views import PageView

urlpatterns = [
    path('', PageView.as_view()),

]
