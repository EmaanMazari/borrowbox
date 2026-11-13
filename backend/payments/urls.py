from django.urls import path
from .views import (
    InitiateUnlockRequestView,
    SubmitPaymentProofView,
    MyUnlockRequestsView,
    CheckUnlockStatusView,
    JazzCashWebhookView,
    EasypaisaWebhookView
)

urlpatterns = [
    path('unlock-request/', InitiateUnlockRequestView.as_view(), name='initiate_unlock'),
    path('unlock-request/<int:pk>/submit-proof/', SubmitPaymentProofView.as_view(), name='submit_payment_proof'),
    path('my-unlocks/', MyUnlockRequestsView.as_view(), name='my_unlock_requests'),
    path('status/<int:listing_id>/', CheckUnlockStatusView.as_view(), name='check_unlock_status'),
    path('webhooks/jazzcash/', JazzCashWebhookView.as_view(), name='webhook_jazzcash'),
    path('webhooks/easypaisa/', EasypaisaWebhookView.as_view(), name='webhook_easypaisa'),
]
