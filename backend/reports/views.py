from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import ListingReport
from .serializers import ListingReportSerializer, ListingReportAdminUpdateSerializer


class CreateListingReportView(generics.CreateAPIView):
    """
    Submit a report for a suspicious or problematic book listing.
    """
    queryset = ListingReport.objects.all()
    serializer_class = ListingReportSerializer
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        reporter = self.request.user if self.request.user.is_authenticated else None
        serializer.save(reporter=reporter)


class ListingReportListView(generics.ListAPIView):
    """
    Admin listing of moderation reports.
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = ListingReportSerializer
    queryset = ListingReport.objects.select_related('listing', 'reporter').all()

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param in ['PENDING', 'RESOLVED', 'DISMISSED']:
            qs = qs.filter(status=status_param)
        return qs


class ListingReportDetailView(generics.RetrieveUpdateAPIView):
    """
    Admin retrieve or update report status.
    """
    permission_classes = (permissions.IsAdminUser,)
    queryset = ListingReport.objects.all()
    serializer_class = ListingReportAdminUpdateSerializer
