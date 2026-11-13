from django.db import models
from django.conf import settings


class ContactUnlockRequest(models.Model):
    """
    Represents a buyer's request to unlock a specific seller's contact information
    for a nominal platform fee of Rs. 100.

    CRITICAL BUSINESS RULES:
    1. The platform does NOT sell, own, or ship books.
    2. Buyers and sellers transact the actual book price directly.
    3. The platform only charges Rs. 100 for verified contact access.
    4. Seller contact information (phone, WhatsApp, email) stays STRICTLY locked
       until this payment status is VERIFIED.
    5. No fake instant success - real transaction ID submission, manual admin verification,
       or automated JazzCash/Easypaisa gateway webhook validation.
    """
    PAYMENT_METHOD_CHOICES = (
        ('jazzcash', 'JazzCash Mobile Account / Voucher'),
        ('easypaisa', 'Easypaisa Mobile Account / QR'),
        ('raast', 'Raast Instant Transfer'),
        ('bank_transfer', 'Online Bank Transfer'),
    )

    STATUS_CHOICES = (
        ('INITIATED', 'Initiated (Awaiting Payment Submission)'),
        ('SUBMITTED', 'Submitted (Payment Proof Under Verification)'),
        ('VERIFIED', 'Verified (Contact Information Unlocked)'),
        ('REJECTED', 'Rejected (Invalid Transaction Details)'),
    )

    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='unlock_requests'
    )
    listing = models.ForeignKey(
        'books.BookListing',
        on_delete=models.CASCADE,
        related_name='unlock_requests'
    )
    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=100.00,
        help_text='Platform contact access fee in PKR (Rs. 100)'
    )
    currency = models.CharField(max_length=10, default='PKR')
    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        default='jazzcash'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='INITIATED',
        db_index=True
    )
    transaction_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_index=True,
        help_text='10-12 digit Transaction ID (TID) from JazzCash/Easypaisa SMS or App'
    )
    sender_mobile = models.CharField(
        max_length=25,
        blank=True,
        null=True,
        help_text='Sender mobile number used to pay the Rs. 100 fee'
    )
    payment_proof = models.ImageField(
        upload_to='payment_receipts/',
        blank=True,
        null=True,
        help_text='Screenshot of successful JazzCash/Easypaisa transfer'
    )
    gateway_reference = models.CharField(
        max_length=120,
        blank=True,
        null=True,
        help_text='Merchant transaction reference for future JazzCash/Easypaisa direct gateway API'
    )
    gateway_raw_data = models.JSONField(
        blank=True,
        null=True,
        help_text='Raw callback/webhook JSON from payment gateway'
    )
    verified_at = models.DateTimeField(blank=True, null=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='verified_unlocks'
    )
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('buyer', 'listing')

    def __str__(self):
        return f"Unlock #{self.id}: {self.buyer.username} -> {self.listing.title} ({self.status})"

    @property
    def is_unlocked(self):
        return self.status == 'VERIFIED'
