from django.urls import path
from .views import CreateListingReportView, ListingReportListView, ListingReportDetailView

urlpatterns = [
    path('submit/', CreateListingReportView.as_view(), name='submit_report'),
    path('admin/list/', ListingReportListView.as_view(), name='admin_reports_list'),
    path('admin/<int:pk>/', ListingReportDetailView.as_view(), name='admin_report_detail'),
]
