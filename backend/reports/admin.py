from django.contrib import admin
from .models import ListingReport


@admin.register(ListingReport)
class ListingReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'listing', 'reason', 'reporter', 'status', 'created_at')
    list_filter = ('status', 'reason')
    search_fields = ('listing__title', 'details', 'reporter__username')
