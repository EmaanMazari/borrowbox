from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from accounts.admin_views import (
    AdminDashboardStatsView,
    AdminPaymentsListView,
    AdminVerifyPaymentActionView,
    AdminUsersListView,
    AdminToggleUserStatusView,
    AdminListingsManageView
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # BookBazar API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/books/', include('books.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reports/', include('reports.urls')),

    # Dedicated Admin Dashboard REST APIs
    path('api/admin-dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin_stats'),
    path('api/admin-dashboard/payments/', AdminPaymentsListView.as_view(), name='admin_payments'),
    path('api/admin-dashboard/payments/<int:pk>/verify/', AdminVerifyPaymentActionView.as_view(), name='admin_verify_payment'),
    path('api/admin-dashboard/users/', AdminUsersListView.as_view(), name='admin_users'),
    path('api/admin-dashboard/users/<int:pk>/toggle-status/', AdminToggleUserStatusView.as_view(), name='admin_toggle_user'),
    path('api/admin-dashboard/listings/', AdminListingsManageView.as_view(), name='admin_listings'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
