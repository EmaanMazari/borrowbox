from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'phone_number', 'city', 'institute', 'is_staff', 'is_verified_seller', 'created_at')
    list_filter = ('city', 'is_staff', 'is_superuser', 'is_verified_seller')
    search_fields = ('username', 'email', 'phone_number', 'institute', 'first_name', 'last_name')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('BookBazar Profile', {
            'fields': ('phone_number', 'whatsapp_number', 'city', 'institute', 'address_area', 'bio', 'avatar', 'is_verified_seller')
        }),
    )
