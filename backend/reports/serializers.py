from rest_framework import serializers
from .models import ListingReport


class ListingReportSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ListingReport
        fields = (
            'id', 'listing', 'listing_title', 'reporter', 'reporter_username',
            'reason', 'reason_display', 'details', 'status', 'status_display',
            'admin_notes', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'reporter', 'status', 'admin_notes', 'created_at', 'updated_at')


class ListingReportAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingReport
        fields = ('status', 'admin_notes')
