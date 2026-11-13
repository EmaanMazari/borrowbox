from django.db import models
from django.conf import settings


class BookListing(models.Model):
    """
    Main Book Listing model for BookBazar.
    Stores used book listings created by sellers for Pakistani students.
    """
    CLASS_CHOICES = (
        ('class_9', 'Class 9 (Matric Part 1)'),
        ('class_10', 'Class 10 (Matric Part 2)'),
        ('fsc_1', 'FSc / ICS / I.Com / FA Part 1 (11th Grade)'),
        ('fsc_2', 'FSc / ICS / I.Com / FA Part 2 (12th Grade)'),
        ('o_levels', 'O Levels / IGCSE'),
        ('a_levels', 'A Levels'),
        ('entry_test', 'MDCAT / ECAT / Entry Test Preparation'),
        ('bachelor_bs', 'University / Undergraduate (BS / BBA / MBBS / Engg)'),
        ('primary_middle', 'Class 1-8 (Primary & Middle)'),
        ('competitive_exams', 'CSS / PMS / Competitive Exams'),
        ('general_reading', 'Novels / Literature / General Knowledge'),
    )

    BOARD_CHOICES = (
        ('punjab_board', 'Punjab Textbook Board (Lahore, Rawalpindi, Multan, etc.)'),
        ('fbise', 'Federal Board (FBISE Islamabad)'),
        ('sindh_board', 'Sindh Textbook Board (Karachi, Hyderabad, Sukkur, etc.)'),
        ('kpk_board', 'KPK Textbook Board (Peshawar, Abbottabad, Mardan, etc.)'),
        ('balochistan_board', 'Balochistan Board (Quetta)'),
        ('cambridge_cie', 'Cambridge International (CIE / Oxford / Edexcel)'),
        ('hec_university', 'HEC / University Syllabus'),
        ('aga_khan_board', 'Aga Khan University Examination Board'),
        ('other', 'Other / General'),
    )

    CONDITION_CHOICES = (
        ('brand_new', 'Brand New (Unused, clean copy)'),
        ('like_new', 'Like New (Minimal notes, crisp pages)'),
        ('good', 'Good (Light highlights/notes, solid spine)'),
        ('fair', 'Fair (Visible markings, cover wear, completely readable)'),
        ('poor', 'Heavily Used (Readable student budget copy)'),
    )

    STATUS_CHOICES = (
        ('ACTIVE', 'Active (Available for Sale)'),
        ('PAUSED', 'Paused (Temporarily on Hold)'),
        ('SOLD', 'Sold (Marked as Sold)'),
    )

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )
    title = models.CharField(max_length=255, db_index=True)
    author = models.CharField(max_length=255, db_index=True)
    isbn = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        db_index=True,
        help_text='ISBN-10, ISBN-13 or barcode number'
    )
    class_grade = models.CharField(
        max_length=50,
        choices=CLASS_CHOICES,
        default='fsc_1',
        db_index=True
    )
    board = models.CharField(
        max_length=50,
        choices=BOARD_CHOICES,
        default='punjab_board',
        db_index=True
    )
    subject = models.CharField(
        max_length=100,
        db_index=True,
        help_text='e.g. Physics, Chemistry, Mathematics, Biology, English, Computer Science'
    )
    edition = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default='Latest Edition',
        help_text='e.g. 2024 Edition, 3rd Edition'
    )
    condition = models.CharField(
        max_length=30,
        choices=CONDITION_CHOICES,
        default='good'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Asking price in Pakistani Rupees (PKR)'
    )
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text='Original retail price in PKR (optional, shows discount %)'
    )
    description = models.TextField(
        help_text='Condition details, handwritten notes, highlights, missing pages if any'
    )
    cover_image = models.ImageField(
        upload_to='book_covers/',
        blank=True,
        null=True
    )
    additional_image = models.ImageField(
        upload_to='book_covers/',
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE',
        db_index=True
    )
    city = models.CharField(
        max_length=50,
        default='lahore',
        db_index=True,
        help_text='City where the book is located'
    )
    area_location = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text='Local campus or public pickup area'
    )
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - Rs. {self.price} by {self.seller.display_name}"

    @property
    def discount_percentage(self):
        if self.original_price and self.original_price > self.price and self.original_price > 0:
            discount = ((self.original_price - self.price) / self.original_price) * 100
            return round(discount)
        return None
