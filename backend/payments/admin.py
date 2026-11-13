from django.contrib import admin
from django.utils import timezone
from .models import ContactUnlockRequest


@admin.register(ContactUnlockRequest)
class ContactUnlockRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'listing', 'amount', 'payment_method', 'transaction_id', 'sender_mobile', 'status', 'created_at', 'verified_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('transaction_id', 'sender_mobile', 'buyer__username', 'buyer__email', 'listing__title')
    actions = ['verify_selected_payments', 'reject_selected_payments']

    @admin.action(description='Verify selected payments and unlock seller contact')
    def verify_selected_payments(self, request, queryset):
        queryset.update(status='VERIFIED', verified_at=timezone.now(), verified_by=request.user)

    @admin.action(description='Reject selected payments')
    def reject_selected_payments(self, request, queryset):
        queryset.update(status='REJECTED')
