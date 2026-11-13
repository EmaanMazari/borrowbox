from django.urls import path
from .views import (
    BookListingListCreateView,
    BookListingDetailView,
    SellerDashboardListingsView,
    SellerListingStatusToggleView,
    ISBNLookupView,
    RecognizeCoverView,
    MetadataChoicesView
)

urlpatterns = [
    path('', BookListingListCreateView.as_view(), name='book_list_create'),
    path('<int:pk>/', BookListingDetailView.as_view(), name='book_detail'),
    path('seller/my-listings/', SellerDashboardListingsView.as_view(), name='seller_my_listings'),
    path('<int:pk>/status/', SellerListingStatusToggleView.as_view(), name='seller_listing_status_toggle'),
    path('isbn-lookup/', ISBNLookupView.as_view(), name='isbn_lookup'),
    path('recognize-cover/', RecognizeCoverView.as_view(), name='recognize_cover'),
    path('metadata-choices/', MetadataChoicesView.as_view(), name='metadata_choices'),
]
