from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom user model for BookBazar.
    Supports dual roles: Buyer and Seller on the same account.
    """
    CITIES_PAKISTAN = (
        ('lahore', 'Lahore'),
        ('karachi', 'Karachi'),
        ('islamabad', 'Islamabad'),
        ('rawalpindi', 'Rawalpindi'),
        ('faisalabad', 'Faisalabad'),
        ('multan', 'Multan'),
        ('peshawar', 'Peshawar'),
        ('quetta', 'Quetta'),
        ('sialkot', 'Sialkot'),
        ('gujranwala', 'Gujranwala'),
        ('hyderabad', 'Hyderabad'),
        ('bahawalpur', 'Bahawalpur'),
        ('sargodha', 'Sargodha'),
        ('abbottabad', 'Abbottabad'),
        ('sukkur', 'Sukkur'),
        ('other', 'Other City'),
    )

    email = models.EmailField(unique=True, verbose_name='Email Address')
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='Direct contact phone number (e.g. 03001234567)'
    )
    whatsapp_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='WhatsApp number for direct buyer-seller messaging once unlocked'
    )
    city = models.CharField(
        max_length=50,
        choices=CITIES_PAKISTAN,
        default='lahore'
    )
    institute = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text='School / College / University (e.g. Punjab University, NUST, FAST, Govt College)'
    )
    address_area = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text='Local campus or area/sector (e.g. New Campus, Gulberg, Johar Town, H-12)'
    )
    bio = models.TextField(blank=True, null=True, max_length=500)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_verified_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.get_full_name() or self.username

    @property
    def display_name(self):
        name = f"{self.first_name} {self.last_name}".strip()
        return name if name else self.username

    @property
    def active_listings_count(self):
        return self.listings.filter(status='ACTIVE').count()

    @property
    def sold_listings_count(self):
        return self.listings.filter(status='SOLD').count()
