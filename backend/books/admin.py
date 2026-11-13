from django.contrib import admin
from .models import BookListing


@admin.register(BookListing)
class BookListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'class_grade', 'board', 'subject', 'price', 'condition', 'status', 'city', 'seller', 'created_at')
    list_filter = ('status', 'class_grade', 'board', 'condition', 'city')
    search_fields = ('title', 'author', 'isbn', 'subject', 'seller__username', 'seller__email')
    list_editable = ('status',)
