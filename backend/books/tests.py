from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from books.models import BookListing
from payments.models import ContactUnlockRequest

User = get_user_model()


class BookBazarCoreFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Seller
        self.seller = User.objects.create_user(
            username='testseller',
            email='seller@test.pk',
            password='Password123!',
            phone_number='03009998877',
            whatsapp_number='03009998877',
            city='lahore',
            institute='Punjab University'
        )

        # Create Buyer
        self.buyer = User.objects.create_user(
            username='testbuyer',
            email='buyer@test.pk',
            password='Password123!',
            phone_number='03215554433',
            city='lahore'
        )

        # Create Admin
        self.admin = User.objects.create_user(
            username='testadmin',
            email='admin@test.pk',
            password='Password123!',
            is_staff=True
        )

        # Create Book Listing
        self.listing = BookListing.objects.create(
            seller=self.seller,
            title='Physics for Class 11 FSc',
            author='Punjab Textbook Board',
            subject='Physics',
            class_grade='fsc_1',
            board='punjab_board',
            price=400.00,
            original_price=800.00,
            condition='good',
            description='Test book description',
            city='lahore'
        )

    def test_book_detail_contact_is_locked_for_unauthenticated_or_unpaid(self):
        """Seller contact phone and whatsapp must remain strictly private if not unlocked."""
        response = self.client.get(f'/api/books/{self.listing.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_contact_unlocked'])
        self.assertIsNone(response.data['unlocked_contact_info'])
        self.assertEqual(response.data['unlock_fee_pkr'], 100.00)

    def test_seller_can_view_own_contact_details(self):
        """The seller themselves can view their own details without paying."""
        self.client.force_authenticate(user=self.seller)
        response = self.client.get(f'/api/books/{self.listing.id}/')
        self.assertTrue(response.data['is_contact_unlocked'])
        self.assertIsNotNone(response.data['unlocked_contact_info'])
        self.assertEqual(response.data['unlocked_contact_info']['phone_number'], '03009998877')

    def test_contact_unlock_lifecycle_no_fake_success(self):
        """Test full contact unlock flow: initiate -> submit proof -> admin verify -> unlock."""
        self.client.force_authenticate(user=self.buyer)

        # 1. Initiate unlock request
        init_res = self.client.post('/api/payments/unlock-request/', {
            'listing_id': self.listing.id,
            'payment_method': 'jazzcash'
        }, format='json')
        self.assertEqual(init_res.status_code, status.HTTP_200_OK)
        unlock_id = init_res.data['unlock_request_id']
        self.assertEqual(init_res.data['status'], 'INITIATED')

        # Contact must still be locked
        detail_res = self.client.get(f'/api/books/{self.listing.id}/')
        self.assertFalse(detail_res.data['is_contact_unlocked'])

        # 2. Submit payment transaction ID (Rs. 100 transfer)
        proof_res = self.client.post(f'/api/payments/unlock-request/{unlock_id}/submit-proof/', {
            'transaction_id': '123456789012',
            'sender_mobile': '03215554433'
        }, format='json')
        self.assertEqual(proof_res.status_code, status.HTTP_200_OK)
        self.assertEqual(proof_res.data['status'], 'SUBMITTED')

        # Contact must STILL be locked (pending verification - no fake instant success!)
        detail_res = self.client.get(f'/api/books/{self.listing.id}/')
        self.assertFalse(detail_res.data['is_contact_unlocked'])

        # 3. Admin verifies payment
        self.client.force_authenticate(user=self.admin)
        verify_res = self.client.post(f'/api/admin-dashboard/payments/{unlock_id}/verify/', {
            'action': 'VERIFY',
            'admin_notes': 'Bank statement verified.'
        }, format='json')
        self.assertEqual(verify_res.status_code, status.HTTP_200_OK)
        self.assertEqual(verify_res.data['status'], 'VERIFIED')

        # 4. Now buyer views book detail -> contact info is completely UNLOCKED!
        self.client.force_authenticate(user=self.buyer)
        final_detail = self.client.get(f'/api/books/{self.listing.id}/')
        self.assertTrue(final_detail.data['is_contact_unlocked'])
        self.assertIsNotNone(final_detail.data['unlocked_contact_info'])
        self.assertEqual(final_detail.data['unlocked_contact_info']['phone_number'], '03009998877')
        self.assertIn('wa.me/923009998877', final_detail.data['unlocked_contact_info']['whatsapp_link'])
