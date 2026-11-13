from rest_framework import serializers
from .models import BookListing
from accounts.serializers import PublicSellerProfileSerializer
from payments.models import ContactUnlockRequest


class BookListingListSerializer(serializers.ModelSerializer):
    """
    Serializer for search results and book catalogs.
    Clearly shows individual sellers and their separate listings.
    """
    seller = PublicSellerProfileSerializer(read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    class_grade_display = serializers.CharField(source='get_class_grade_display', read_only=True)
    board_display = serializers.CharField(source='get_board_display', read_only=True)
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = BookListing
        fields = (
            'id', 'title', 'author', 'isbn', 'class_grade', 'class_grade_display',
            'board', 'board_display', 'subject', 'edition', 'condition',
            'condition_display', 'price', 'original_price', 'discount_percentage',
            'cover_image', 'status', 'status_display', 'city', 'area_location',
            'views_count', 'seller', 'created_at'
        )


class BookListingDetailSerializer(serializers.ModelSerializer):
    """
    Detailed book view with the locked/unlocked contact section.
    Rigorously enforces privacy: seller phone, WhatsApp, email remain locked
    until payment is verified.
    """
    seller = PublicSellerProfileSerializer(read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    class_grade_display = serializers.CharField(source='get_class_grade_display', read_only=True)
    board_display = serializers.CharField(source='get_board_display', read_only=True)
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    # Contact Unlock Section fields
    is_contact_unlocked = serializers.SerializerMethodField()
    unlocked_contact_info = serializers.SerializerMethodField()
    user_unlock_status = serializers.SerializerMethodField()
    user_unlock_request_id = serializers.SerializerMethodField()
    unlock_fee_pkr = serializers.SerializerMethodField()

    class Meta:
        model = BookListing
        fields = (
            'id', 'title', 'author', 'isbn', 'class_grade', 'class_grade_display',
            'board', 'board_display', 'subject', 'edition', 'condition',
            'condition_display', 'price', 'original_price', 'discount_percentage',
            'description', 'cover_image', 'additional_image', 'status',
            'status_display', 'city', 'area_location', 'views_count',
            'seller', 'is_contact_unlocked', 'unlocked_contact_info',
            'user_unlock_status', 'user_unlock_request_id', 'unlock_fee_pkr',
            'created_at', 'updated_at'
        )

    def get_unlock_fee_pkr(self, obj):
        return 100.00

    def _get_unlock_request(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        return ContactUnlockRequest.objects.filter(buyer=request.user, listing=obj).first()

    def get_is_contact_unlocked(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False

        # Seller can always see their own contact details
        if request.user.id == obj.seller_id:
            return True

        # Check if buyer has a verified payment
        unlock = self._get_unlock_request(obj)
        return bool(unlock and unlock.status == 'VERIFIED')

    def get_user_unlock_status(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        if request.user.id == obj.seller_id:
            return 'OWNER'
        unlock = self._get_unlock_request(obj)
        return unlock.status if unlock else 'NOT_REQUESTED'

    def get_user_unlock_request_id(self, obj):
        unlock = self._get_unlock_request(obj)
        return unlock.id if unlock else None

    def get_unlocked_contact_info(self, obj):
        """
        Returns real seller contact details ONLY IF unlocked.
        Returns None if locked.
        """
        if not self.get_is_contact_unlocked(obj):
            return None

        seller = obj.seller
        phone = seller.phone_number or ''
        whatsapp = seller.whatsapp_number or phone or ''

        # Prepare direct WhatsApp click-to-chat URL
        clean_wa = whatsapp.replace('+', '').replace('-', '').replace(' ', '')
        if clean_wa.startswith('0'):
            clean_wa = '92' + clean_wa[1:]

        whatsapp_link = f"https://wa.me/{clean_wa}?text=Assalam-o-Alaikum!%20I%20am%20interested%20in%20buying%20your%20book%20'{obj.title}'%20listed%20on%20BookBazar." if clean_wa else None

        return {
            'phone_number': phone,
            'whatsapp_number': whatsapp,
            'email': seller.email,
            'meetup_area': seller.address_area or obj.area_location,
            'city': seller.city or obj.city,
            'institute': seller.institute,
            'whatsapp_link': whatsapp_link,
            'notice': 'Verified Contact Details. Please follow safe meetup guidelines and inspect the book before paying the seller.'
        }


class BookListingCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating book listings.
    Automatically assigns the authenticated user as the seller.
    """
    class Meta:
        model = BookListing
        fields = (
            'id', 'title', 'author', 'isbn', 'class_grade', 'board',
            'subject', 'edition', 'condition', 'price', 'original_price',
            'description', 'cover_image', 'additional_image', 'status',
            'city', 'area_location'
        )

    def create(self, validated_data):
        user = self.context['request'].user
        # Default city and area to user's profile if not explicitly specified
        if not validated_data.get('city') and user.city:
            validated_data['city'] = user.city
        if not validated_data.get('area_location') and user.address_area:
            validated_data['area_location'] = user.address_area

        return BookListing.objects.create(seller=user, **validated_data)
