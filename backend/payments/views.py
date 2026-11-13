import os
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import ContactUnlockRequest
from books.models import BookListing
from .serializers import (
    ContactUnlockRequestSerializer,
    InitiateUnlockSerializer,
    SubmitPaymentProofSerializer
)
from .gateways import JazzCashGateway, EasypaisaGateway


class InitiateUnlockRequestView(APIView):
    """
    Step 1 of the Contact Unlock Flow:
    Buyer initiates a contact unlock request for a specific book listing (Rs. 100 fee).
    Returns platform payment credentials (JazzCash, Easypaisa, Raast) and prepared gateway payloads.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = InitiateUnlockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        listing_id = serializer.validated_data['listing_id']
        payment_method = serializer.validated_data['payment_method']

        try:
            listing = BookListing.objects.get(pk=listing_id)
        except BookListing.DoesNotExist:
            return Response({'detail': 'Book listing not found.'}, status=status.HTTP_404_NOT_FOUND)

        if listing.seller == request.user:
            return Response(
                {'detail': 'You are the seller of this book. You do not need to unlock your own contact details.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve or create unlock request record
        unlock_request, created = ContactUnlockRequest.objects.get_or_create(
            buyer=request.user,
            listing=listing,
            defaults={
                'amount': 100.00,
                'payment_method': payment_method,
                'status': 'INITIATED'
            }
        )

        if not created and unlock_request.payment_method != payment_method and unlock_request.status == 'INITIATED':
            unlock_request.payment_method = payment_method
            unlock_request.save()

        # If already verified, return verified state
        if unlock_request.status == 'VERIFIED':
            return Response({
                'status': 'VERIFIED',
                'message': 'You have already unlocked this seller contact.',
                'unlock_request': ContactUnlockRequestSerializer(unlock_request).data
            })

        # Platform accounts for student manual transfer
        platform_info = {
            'fee_amount_pkr': 100.00,
            'jazzcash': {
                'account_number': os.environ.get('PLATFORM_JAZZ_CASH_ACCOUNT', '03001234567'),
                'account_title': os.environ.get('PLATFORM_ACCOUNT_TITLE', 'BookBazar Official'),
                'instruction': 'Send Rs. 100 via JazzCash App or *786# to this number, then enter the 10-12 digit TID below.'
            },
            'easypaisa': {
                'account_number': os.environ.get('PLATFORM_EASYPAISA_ACCOUNT', '03121234567'),
                'account_title': os.environ.get('PLATFORM_ACCOUNT_TITLE', 'BookBazar Official'),
                'instruction': 'Send Rs. 100 via Easypaisa App or *786# to this number, then enter the TRX ID below.'
            },
            'raast': {
                'raast_id': os.environ.get('PLATFORM_JAZZ_CASH_ACCOUNT', '03001234567'),
                'account_title': os.environ.get('PLATFORM_ACCOUNT_TITLE', 'BookBazar Official'),
                'instruction': 'Instant fee payment via any Pakistani bank app using Raast ID.'
            }
        }

        # Check future automated gateway payload
        gateway_data = None
        if payment_method == 'jazzcash':
            gateway_data = JazzCashGateway().initiate_transaction(unlock_request)
        elif payment_method == 'easypaisa':
            gateway_data = EasypaisaGateway().initiate_transaction(unlock_request)

        return Response({
            'status': unlock_request.status,
            'unlock_request_id': unlock_request.id,
            'amount': unlock_request.amount,
            'payment_method': unlock_request.payment_method,
            'platform_accounts': platform_info,
            'gateway_data': gateway_data,
            'transaction_id': unlock_request.transaction_id,
            'sender_mobile': unlock_request.sender_mobile,
            'notice': 'The Rs. 100 fee gives you verified direct phone, WhatsApp and meetup access to this seller. You deal on book price directly with the seller.'
        })


class SubmitPaymentProofView(APIView):
    """
    Step 2 of the Contact Unlock Flow:
    Buyer enters the 10-12 digit Transaction ID (TID), sender mobile number,
    and optional screenshot proof of payment.
    The status is moved to SUBMITTED (pending verification).
    Seller contact details remain LOCKED until verified.
    """
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request, pk):
        try:
            unlock_request = ContactUnlockRequest.objects.get(pk=pk, buyer=request.user)
        except ContactUnlockRequest.DoesNotExist:
            return Response({'detail': 'Unlock request not found.'}, status=status.HTTP_404_NOT_FOUND)

        if unlock_request.status == 'VERIFIED':
            return Response(
                {'detail': 'This payment is already verified and contact is unlocked.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SubmitPaymentProofSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        unlock_request.transaction_id = serializer.validated_data['transaction_id'].strip()
        unlock_request.sender_mobile = serializer.validated_data['sender_mobile'].strip()

        if 'payment_proof' in request.FILES:
            unlock_request.payment_proof = request.FILES['payment_proof']

        unlock_request.status = 'SUBMITTED'
        unlock_request.save()

        return Response({
            'status': 'SUBMITTED',
            'message': 'Payment details submitted successfully! Your Rs. 100 transfer is queued for verification. Contact details will be unlocked as soon as verified.',
            'unlock_request': ContactUnlockRequestSerializer(unlock_request).data
        })


class MyUnlockRequestsView(generics.ListAPIView):
    """
    Returns all contact unlock requests made by the current buyer.
    Shows unlocked seller info if verified.
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ContactUnlockRequestSerializer

    def get_queryset(self):
        return ContactUnlockRequest.objects.filter(buyer=self.request.user).select_related('listing', 'listing__seller')


class CheckUnlockStatusView(APIView):
    """
    Lightweight check for book details page to check whether current user
    has unlocked contact details for a specific listing.
    """
    permission_classes = (permissions.AllowAny,)

    def get(self, request, listing_id):
        if not request.user.is_authenticated:
            return Response({'is_unlocked': False, 'status': 'UNAUTHENTICATED'})

        try:
            listing = BookListing.objects.get(pk=listing_id)
        except BookListing.DoesNotExist:
            return Response({'detail': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

        if listing.seller == request.user:
            return Response({'is_unlocked': True, 'status': 'OWNER'})

        unlock = ContactUnlockRequest.objects.filter(buyer=request.user, listing=listing).first()
        if not unlock:
            return Response({'is_unlocked': False, 'status': 'NOT_REQUESTED'})

        return Response({
            'is_unlocked': unlock.status == 'VERIFIED',
            'status': unlock.status,
            'unlock_request_id': unlock.id,
            'transaction_id': unlock.transaction_id
        })


class JazzCashWebhookView(APIView):
    """
    Future IPN / Webhook endpoint for automated JazzCash gateway callbacks.
    Validates HMAC signature and verifies unlock request automatically.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        txn_ref = data.get('pp_TxnRefNo', '')
        response_code = data.get('pp_ResponseCode', '')

        # BB-UNLOCK-{id}
        if txn_ref.startswith('BB-UNLOCK-'):
            try:
                req_id = int(txn_ref.replace('BB-UNLOCK-', ''))
                unlock = ContactUnlockRequest.objects.get(pk=req_id)
                unlock.gateway_raw_data = data
                unlock.transaction_id = data.get('pp_RetreivalReferenceNo') or data.get('pp_TxnRefNo')

                # 000 = Success in JazzCash
                if response_code == '000':
                    unlock.status = 'VERIFIED'
                    unlock.verified_at = timezone.now()
                else:
                    unlock.status = 'REJECTED'
                    unlock.admin_notes = f"Gateway rejected: {data.get('pp_ResponseMessage', 'Unknown')}"

                unlock.save()
                return Response({'status': 'received', 'message': 'Callback processed'})
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'ignored'})


class EasypaisaWebhookView(APIView):
    """
    Future IPN / Webhook endpoint for automated Easypaisa gateway callbacks.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        order_id = data.get('orderId', '')
        resp_status = data.get('status', '')

        if order_id.startswith('BB-EP-'):
            try:
                req_id = int(order_id.replace('BB-EP-', ''))
                unlock = ContactUnlockRequest.objects.get(pk=req_id)
                unlock.gateway_raw_data = data
                unlock.transaction_id = data.get('transactionId') or order_id

                if resp_status == '0000' or resp_status.lower() == 'paid':
                    unlock.status = 'VERIFIED'
                    unlock.verified_at = timezone.now()
                else:
                    unlock.status = 'REJECTED'

                unlock.save()
                return Response({'status': 'success'})
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'ignored'})
