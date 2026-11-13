from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from .models import BookListing
from .serializers import (
    BookListingListSerializer,
    BookListingDetailSerializer,
    BookListingCreateUpdateSerializer
)
from .isbn_service import lookup_isbn_metadata
from .image_recognition_service import BookCoverRecognitionService


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a listing to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.seller == request.user or request.user.is_staff


class BookListingListCreateView(generics.ListCreateAPIView):
    """
    List active book listings with multi-attribute filtering,
    or create a new listing (for authenticated users).
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookListingCreateUpdateSerializer
        return BookListingListSerializer

    def get_queryset(self):
        # Public listing catalog displays ACTIVE listings
        queryset = BookListing.objects.select_related('seller').filter(status='ACTIVE')

        # Multi-attribute search query
        q = self.request.query_params.get('search', '').strip()
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) |
                Q(author__icontains=q) |
                Q(subject__icontains=q) |
                Q(description__icontains=q) |
                Q(isbn__icontains=q)
            )

        # Filters for Pakistani students
        class_grade = self.request.query_params.get('class_grade')
        if class_grade:
            queryset = queryset.filter(class_grade=class_grade)

        board = self.request.query_params.get('board')
        if board:
            queryset = queryset.filter(board=board)

        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(subject__icontains=subject)

        condition = self.request.query_params.get('condition')
        if condition:
            queryset = queryset.filter(condition=condition)

        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__iexact=city)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # Sort order
        sort = self.request.query_params.get('sort', 'newest')
        if sort == 'price_low':
            queryset = queryset.order_by('price')
        elif sort == 'price_high':
            queryset = queryset.order_by('-price')
        elif sort == 'popular':
            queryset = queryset.order_by('-views_count')
        else:
            queryset = queryset.order_by('-created_at')

        return queryset


class BookListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a specific book listing.
    Includes locked/unlocked contact details in GET.
    """
    queryset = BookListing.objects.select_related('seller').all()
    permission_classes = (IsOwnerOrReadOnly,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BookListingCreateUpdateSerializer
        return BookListingDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment views count safely
        BookListing.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        instance.views_count += 1
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class SellerDashboardListingsView(generics.ListAPIView):
    """
    Returns all listings belonging to the authenticated seller (ACTIVE, PAUSED, SOLD).
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BookListingListSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = BookListing.objects.filter(seller=user).select_related('seller')

        status_param = self.request.query_params.get('status')
        if status_param in ['ACTIVE', 'PAUSED', 'SOLD']:
            queryset = queryset.filter(status=status_param)

        return queryset.order_by('-created_at')


class SellerListingStatusToggleView(APIView):
    """
    Quickly pause, resume or mark a listing as sold.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, pk):
        try:
            listing = BookListing.objects.get(pk=pk, seller=request.user)
        except BookListing.DoesNotExist:
            return Response({'detail': 'Listing not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['ACTIVE', 'PAUSED', 'SOLD']:
            return Response({'detail': 'Invalid status. Choose ACTIVE, PAUSED, or SOLD.'}, status=status.HTTP_400_BAD_REQUEST)

        listing.status = new_status
        listing.save()
        return Response({
            'id': listing.id,
            'status': listing.status,
            'message': f"Listing status updated to {new_status}."
        })


class ISBNLookupView(APIView):
    """
    API endpoint for barcode / ISBN scanning support.
    Accepts ?isbn=... and retrieves title, author, edition, cover from Open Library / Google Books.
    """
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        isbn = request.query_params.get('isbn', '').strip()
        if not isbn:
            return Response({'detail': 'Please provide an ISBN or barcode parameter.'}, status=status.HTTP_400_BAD_REQUEST)

        data = lookup_isbn_metadata(isbn)
        return Response(data)


class RecognizeCoverView(APIView):
    """
    API endpoint for cover image upload & extensible image-recognition hook.
    """
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        image = request.FILES.get('cover_image')
        if not image:
            return Response({'detail': 'Please upload a cover image file.'}, status=status.HTTP_400_BAD_REQUEST)

        analysis = BookCoverRecognitionService.recognize_cover(image)
        return Response(analysis)


class MetadataChoicesView(APIView):
    """
    Returns list of classes, boards, conditions and cities for frontend select inputs.
    """
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        from accounts.models import User
        return Response({
            'classes': [{'value': c[0], 'label': c[1]} for c in BookListing.CLASS_CHOICES],
            'boards': [{'value': b[0], 'label': b[1]} for b in BookListing.BOARD_CHOICES],
            'conditions': [{'value': c[0], 'label': c[1]} for c in BookListing.CONDITION_CHOICES],
            'cities': [{'value': c[0], 'label': c[1]} for c in User.CITIES_PAKISTAN],
            'default_unlock_fee': 100.00
        })
