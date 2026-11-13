from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from books.models import BookListing
from payments.models import ContactUnlockRequest
from reports.models import ListingReport

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds realistic sample data for BookBazar (Pakistani student marketplace)'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding sample users, book listings, and contact unlock transactions...")

        # 1. Admin Superuser
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@bookbazar.pk',
                'first_name': 'Platform',
                'last_name': 'Administrator',
                'is_staff': True,
                'is_superuser': True,
                'phone_number': '03001234567',
                'whatsapp_number': '03001234567',
                'city': 'islamabad',
                'institute': 'BookBazar HQ Islamabad',
                'address_area': 'Blue Area, F-6'
            }
        )
        if created or not admin_user.check_password('admin123'):
            admin_user.set_password('admin123')
            admin_user.save()

        # 2. Student Users (Both Buyers and Sellers)
        students_data = [
            {
                'username': 'ali_nust',
                'email': 'ali.ahmed@nust.edu.pk',
                'first_name': 'Ali',
                'last_name': 'Ahmed',
                'phone_number': '03018899123',
                'whatsapp_number': '03018899123',
                'city': 'islamabad',
                'institute': 'NUST Islamabad (H-12 Campus)',
                'address_area': 'H-12 Hostel / G-11',
                'bio': 'Final year CS student at NUST. Selling FSc prep material and engineering textbooks.',
                'is_verified_seller': True,
                'password': 'password123'
            },
            {
                'username': 'zainab_pu',
                'email': 'zainab.k@pu.edu.pk',
                'first_name': 'Zainab',
                'last_name': 'Khan',
                'phone_number': '03214567890',
                'whatsapp_number': '03214567890',
                'city': 'lahore',
                'institute': 'Punjab University (New Campus)',
                'address_area': 'Garden Town / Muslim Town',
                'bio': 'Pre-Medical student at PU. Selling clean, highlighted FSc Biology and MDCAT guides.',
                'is_verified_seller': True,
                'password': 'password123'
            },
            {
                'username': 'hamza_fast',
                'email': 'hamza.tariq@nu.edu.pk',
                'first_name': 'Hamza',
                'last_name': 'Tariq',
                'phone_number': '03339876543',
                'whatsapp_number': '03339876543',
                'city': 'karachi',
                'institute': 'FAST-NUCES Karachi',
                'address_area': 'Gulshan-e-Iqbal Block 5',
                'bio': 'A-Levels and CS textbooks available. Can meet on campus or ship via Leopard/TCS.',
                'is_verified_seller': True,
                'password': 'password123'
            },
            {
                'username': 'bilal_buyer',
                'email': 'bilal.student@gmail.com',
                'first_name': 'Bilal',
                'last_name': 'Hassan',
                'phone_number': '03451122334',
                'whatsapp_number': '03451122334',
                'city': 'rawalpindi',
                'institute': 'Punjab Group of Colleges (PGC Rawalpindi)',
                'address_area': 'Saddar / Westridge',
                'bio': 'Matric student preparing for FSc Pre-Engineering admission.',
                'is_verified_seller': False,
                'password': 'password123'
            }
        ]

        created_users = {}
        for s in students_data:
            pw = s.pop('password')
            u, _ = User.objects.get_or_create(username=s['username'], defaults=s)
            u.set_password(pw)
            u.save()
            created_users[u.username] = u

        # 3. Realistic Used Book Listings across Pakistani curriculum
        books_data = [
            {
                'seller': created_users['zainab_pu'],
                'title': 'FSc Biology Part 1 (11th Grade)',
                'author': 'Punjab Textbook Board (Dr. Hamid Malik)',
                'isbn': '9789694461234',
                'class_grade': 'fsc_1',
                'board': 'punjab_board',
                'subject': 'Biology',
                'edition': '2024 Revised Edition',
                'condition': 'like_new',
                'price': 450.00,
                'original_price': 850.00,
                'description': 'Very clean textbook used carefully for 1 year. All diagrams intact. Neatly underlined key definitions with mild yellow highlighter. Perfect for Board exams and MDCAT revision.',
                'city': 'lahore',
                'area_location': 'PU New Campus / Canal Road',
                'status': 'ACTIVE',
                'views_count': 142
            },
            {
                'seller': created_users['zainab_pu'],
                'title': 'KIPS MDCAT Prep Series: Chemistry & Biology Formula Book',
                'author': 'KIPS Preparatory Publications',
                'isbn': '9789698822001',
                'class_grade': 'entry_test',
                'board': 'punjab_board',
                'subject': 'MDCAT / Chemistry & Biology',
                'edition': '2024 Latest Session',
                'condition': 'good',
                'price': 950.00,
                'original_price': 2200.00,
                'description': 'Complete KIPS MDCAT series with MCQs, past papers (2018-2023) solved with explanation notes. Minor pencil ticks on practice exercises.',
                'city': 'lahore',
                'area_location': 'Gulberg III / Johar Town',
                'status': 'ACTIVE',
                'views_count': 320
            },
            {
                'seller': created_users['ali_nust'],
                'title': 'Physics for Class 10 (Federal Board FBISE)',
                'author': 'National Book Foundation / Federal Board',
                'isbn': '9789693708892',
                'class_grade': 'class_10',
                'board': 'fbise',
                'subject': 'Physics',
                'edition': 'Latest FBISE Curriculum',
                'condition': 'good',
                'price': 350.00,
                'original_price': 600.00,
                'description': 'Original FBISE prescribed textbook. Contains all chapter numericals solved in pencil on margins. Very helpful for matric board papers.',
                'city': 'islamabad',
                'area_location': 'NUST H-12 Gate 2 / G-11 Markaz',
                'status': 'ACTIVE',
                'views_count': 88
            },
            {
                'seller': created_users['ali_nust'],
                'title': 'Calculus: Early Transcendentals',
                'author': 'James Stewart',
                'isbn': '9781285741550',
                'class_grade': 'bachelor_bs',
                'board': 'hec_university',
                'subject': 'Mathematics / Engineering',
                'edition': '8th International Edition',
                'condition': 'fair',
                'price': 1200.00,
                'original_price': 3500.00,
                'description': 'Essential calculus text for BS Computer Science, Software Engineering and Electrical Engineering across NUST, FAST, and GIKI. Binding is intact, some chapter wear on corners.',
                'city': 'islamabad',
                'area_location': 'NUST Campus / F-10 Markaz',
                'status': 'ACTIVE',
                'views_count': 210
            },
            {
                'seller': created_users['hamza_fast'],
                'title': 'Cambridge International AS & A Level Chemistry',
                'author': 'Peter Cann & Peter Hughes (Hodder Education)',
                'isbn': '9781444112832',
                'class_grade': 'a_levels',
                'board': 'cambridge_cie',
                'subject': 'Chemistry',
                'edition': '3rd Edition (Endorsed by Cambridge)',
                'condition': 'like_new',
                'price': 2200.00,
                'original_price': 6800.00,
                'description': 'High quality UK import edition with complete full-colour diagrams, organic synthesis pathways, and Cambridge exam style questions. No loose pages.',
                'city': 'karachi',
                'area_location': 'FAST Karachi / Gulshan-e-Iqbal',
                'status': 'ACTIVE',
                'views_count': 95
            },
            {
                'seller': created_users['hamza_fast'],
                'title': 'Computer Science for Matric (Class 9 & 10 Sindh Board)',
                'author': 'Sindh Textbook Board Jamshoro',
                'isbn': '9789694469988',
                'class_grade': 'class_9',
                'board': 'sindh_board',
                'subject': 'Computer Science',
                'edition': '2023 Edition',
                'condition': 'brand_new',
                'price': 300.00,
                'original_price': 500.00,
                'description': 'Brand new unread condition. Includes Python basics, logic gates, and computing fundamentals for Sindh Board matriculation.',
                'city': 'karachi',
                'area_location': 'Bahadurabad / Tariq Road',
                'status': 'ACTIVE',
                'views_count': 74
            },
            {
                'seller': created_users['zainab_pu'],
                'title': 'Physics Part 1 (11th Grade FSc)',
                'author': 'Punjab Textbook Board Lahore',
                'isbn': '9789694465543',
                'class_grade': 'fsc_1',
                'board': 'punjab_board',
                'subject': 'Physics',
                'edition': '2024 Edition',
                'condition': 'good',
                'price': 400.00,
                'original_price': 750.00,
                'description': 'Official PTB textbook with all chapters (Measurement, Vectors, Motion & Force, Work & Energy). Notes and numerical solutions included.',
                'city': 'lahore',
                'area_location': 'PU New Campus / Ichhra',
                'status': 'PAUSED',
                'views_count': 115
            }
        ]

        created_listings = []
        for b in books_data:
            listing, _ = BookListing.objects.get_or_create(
                title=b['title'],
                seller=b['seller'],
                defaults=b
            )
            created_listings.append(listing)

        # 4. Realistic Contact Unlock Requests for Testing
        # - One VERIFIED request (buyer: bilal_buyer -> listing: FSc Biology by zainab_pu)
        unlock_verified, _ = ContactUnlockRequest.objects.get_or_create(
            buyer=created_users['bilal_buyer'],
            listing=created_listings[0],
            defaults={
                'amount': 100.00,
                'payment_method': 'jazzcash',
                'status': 'VERIFIED',
                'transaction_id': '092837461234',
                'sender_mobile': '03451122334',
                'admin_notes': 'Verified transaction ID via JazzCash statement',
                'verified_by': admin_user
            }
        )

        # - One SUBMITTED (pending verification) request for Admin Dashboard review
        #   (buyer: bilal_buyer -> listing: Physics for Class 10 by ali_nust)
        unlock_pending, _ = ContactUnlockRequest.objects.get_or_create(
            buyer=created_users['bilal_buyer'],
            listing=created_listings[2],
            defaults={
                'amount': 100.00,
                'payment_method': 'easypaisa',
                'status': 'SUBMITTED',
                'transaction_id': '984512308761',
                'sender_mobile': '03451122334'
            }
        )

        # 5. Sample Listing Report for Moderation
        ListingReport.objects.get_or_create(
            listing=created_listings[3],
            reporter=created_users['bilal_buyer'],
            defaults={
                'reason': 'misleading_price',
                'details': 'Original retail price was listed slightly higher than market standard, asking seller to verify edition.',
                'status': 'PENDING'
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded BookBazar database with realistic Pakistani student data!"))
