from django.db import models
from django.conf import settings


class ListingReport(models.Model):
    """
    User-submitted reports for moderation on BookBazar listings.
    """
    REASON_CHOICES = (
        ('misleading_price', 'Misleading or fraudulent price'),
        ('wrong_syllabus', 'Incorrect curriculum board / edition stated'),
        ('sold_already', 'Book is already sold or unavailable'),
        ('fake_listing', 'Suspicious or duplicate listing'),
        ('inappropriate', 'Inappropriate images, remarks or description'),
        ('unresponsive', 'Seller contact is invalid or unresponsive'),
        ('other', 'Other issue'),
    )

    STATUS_CHOICES = (
        ('PENDING', 'Pending Review'),
        ('RESOLVED', 'Resolved (Action Taken)'),
        ('DISMISSED', 'Dismissed (Listing Clean)'),
    )

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='submitted_reports'
    )
    listing = models.ForeignKey(
        'books.BookListing',
        on_delete=models.CASCADE,
        related_name='reports'
    )
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    details = models.TextField(help_text='Explain why you are reporting this listing')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Report #{self.id} on {self.listing.title} ({self.reason})"
