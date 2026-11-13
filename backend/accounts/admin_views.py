from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Sum, Count
from books.models import BookListing
from books.serializers import BookListingListSerializer
from payments.models import ContactUnlockRequest
from payments.serializers import ContactUnlockRequestSerializer
from reports.models import ListingReport
from reports.serializers import ListingReportSerializer
from .serializers import UserProfileSerializer

User = get_user_model()


class AdminDashboardStatsView(APIView):
    """
    Returns platform-wide metrics for the Admin Dashboard.
    """
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        total_users = User.objects.count()
        total_listings = BookListing.objects.count()
        active_listings = BookListing.objects.filter(status='ACTIVE').count()
        sold_listings = BookListing.objects.filter(status='SOLD').count()
        paused_listings = BookListing.objects.filter(status='PAUSED').count()

        unlock_requests_total = ContactUnlockRequest.objects.count()
        pending_verifications = ContactUnlockRequest.objects.filter(status='SUBMITTED').count()
        verified_unlocks = ContactUnlockRequest.objects.filter(status='VERIFIED').count()
        rejected_unlocks = ContactUnlockRequest.objects.filter(status='REJECTED').count()

        # Total contact access revenue in PKR (Rs. 100 per verified unlock)
        total_revenue = verified_unlocks * 100.00

        pending_reports = ListingReport.objects.filter(status='PENDING').count()

        return Response({
            'users': {
                'total': total_users,
            },
            'listings': {
                'total': total_listings,
                'active': active_listings,
                'sold': sold_listings,
                'paused': paused_listings,
            },
            'payments': {
                'total_requests': unlock_requests_total,
                'pending_verification': pending_verifications,
                'verified': verified_unlocks,
                'rejected': rejected_unlocks,
                'total_revenue_pkr': total_revenue,
            },
            'moderation': {
                'pending_reports': pending_reports,
            }
        })


class AdminPaymentsListView(generics.ListAPIView):
    """
    Admin listing of contact unlock payment requests.
    Supports ?status=SUBMITTED / VERIFIED / REJECTED.
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = ContactUnlockRequestSerializer

    def get_queryset(self):
        qs = ContactUnlockRequest.objects.select_related('buyer', 'listing', 'listing__seller').all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs.order_by('-created_at')


class AdminVerifyPaymentActionView(APIView):
    """
    Admin action to verify or reject a submitted Rs. 100 contact-unlock payment.
    When verified, the seller's contact information is unlocked for the buyer.
    """
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, pk):
        try:
            unlock_request = ContactUnlockRequest.objects.get(pk=pk)
        except ContactUnlockRequest.DoesNotExist:
            return Response({'detail': 'Unlock request not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'VERIFY' or 'REJECT'
        admin_notes = request.data.get('admin_notes', '')

        if action == 'VERIFY':
            unlock_request.status = 'VERIFIED'
            unlock_request.verified_at = timezone.now()
            unlock_request.verified_by = request.user
            unlock_request.admin_notes = admin_notes
            unlock_request.save()
            return Response({
                'status': 'VERIFIED',
                'message': f"Payment #{unlock_request.id} verified. Seller contact info is now unlocked for {unlock_request.buyer.username}.",
                'data': ContactUnlockRequestSerializer(unlock_request).data
            })
        elif action == 'REJECT':
            unlock_request.status = 'REJECTED'
            unlock_request.admin_notes = admin_notes or 'Transaction ID could not be confirmed.'
            unlock_request.save()
            return Response({
                'status': 'REJECTED',
                'message': f"Payment #{unlock_request.id} marked as rejected.",
                'data': ContactUnlockRequestSerializer(unlock_request).data
            })
        else:
            return Response(
                {'detail': "Invalid action. Must be 'VERIFY' or 'REJECT'."},
                status=status.HTTP_400_BAD_REQUEST
            )


class AdminUsersListView(generics.ListAPIView):
    """
    Admin listing of registered users.
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        qs = User.objects.all().order_by('-date_joined')
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                username__icontains=search) | qs.filter(
                email__icontains=search) | qs.filter(
                first_name__icontains=search) | qs.filter(
                phone_number__icontains=search
            )
        return qs


class AdminToggleUserStatusView(APIView):
    """
    Admin toggle user active/banned status.
    """
    permission_classes = (permissions.IsAdminUser,)

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_superuser:
            return Response({'detail': 'Cannot deactivate superuser account.'}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = not user.is_active
        user.save()
        status_text = 'activated' if user.is_active else 'deactivated / banned'
        return Response({
            'user_id': user.id,
            'is_active': user.is_active,
            'message': f"User {user.username} has been {status_text}."
        })


class AdminListingsManageView(generics.ListAPIView):
    """
    Admin view of all listings across the platform.
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = BookListingListSerializer

    def get_queryset(self):
        qs = BookListing.objects.select_related('seller').all().order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs
