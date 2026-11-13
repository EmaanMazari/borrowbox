from rest_framework import serializers
from .models import ContactUnlockRequest
from books.models import BookListing
from accounts.serializers import PublicSellerProfileSerializer


class MiniListingSerializer(serializers.ModelSerializer):
    seller = PublicSellerProfileSerializer(read_only=True)

    class Meta:
        model = BookListing
        fields = ('id', 'title', 'author', 'price', 'condition', 'city', 'cover_image', 'status', 'seller')


class ContactUnlockRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for buyer's unlock requests.
    Exposes seller's contact details ONLY IF payment is verified!
    """
    listing = MiniListingSerializer(read_only=True)
    unlocked_contact_info = serializers.SerializerMethodField()

    class Meta:
        model = ContactUnlockRequest
        fields = (
            'id', 'buyer', 'listing', 'amount', 'currency', 'payment_method',
            'status', 'transaction_id', 'sender_mobile', 'payment_proof',
            'gateway_reference', 'unlocked_contact_info', 'created_at',
            'verified_at', 'admin_notes'
        )
        read_only_fields = ('id', 'buyer', 'status', 'gateway_reference', 'verified_at', 'admin_notes', 'created_at')

    def get_unlocked_contact_info(self, obj):
        # Strict privacy enforcement: NO CONTACT EXPOSURE UNLESS VERIFIED
        if obj.status != 'VERIFIED':
            return None

        seller = obj.listing.seller
        phone = seller.phone_number or ''
        whatsapp = seller.whatsapp_number or phone or ''

        clean_wa = whatsapp.replace('+', '').replace('-', '').replace(' ', '')
        if clean_wa.startswith('0'):
            clean_wa = '92' + clean_wa[1:]

        whatsapp_link = f"https://wa.me/{clean_wa}?text=Assalam-o-Alaikum!%20I%20unlocked%20your%20contact%20on%20BookBazar%20for%20'{obj.listing.title}'." if clean_wa else None

        return {
            'seller_name': seller.display_name,
            'phone_number': phone,
            'whatsapp_number': whatsapp,
            'email': seller.email,
            'city': seller.city,
            'institute': seller.institute,
            'meetup_area': seller.address_area or obj.listing.area_location,
            'whatsapp_link': whatsapp_link,
            'verified_badge': 'Platform Verified Contact'
        }


class InitiateUnlockSerializer(serializers.Serializer):
    listing_id = serializers.IntegerField(required=True)
    payment_method = serializers.ChoiceField(
        choices=ContactUnlockRequest.PAYMENT_METHOD_CHOICES,
        default='jazzcash'
    )


class SubmitPaymentProofSerializer(serializers.Serializer):
    transaction_id = serializers.CharField(
        max_length=100,
        required=True,
        help_text='10-12 digit JazzCash or Easypaisa transaction ID'
    )
    sender_mobile = serializers.CharField(
        max_length=25,
        required=True,
        help_text='Mobile number used to make the Rs. 100 transfer'
    )
    payment_proof = serializers.ImageField(
        required=False,
        allow_null=True,
        help_text='Screenshot of successful transfer'
    )
