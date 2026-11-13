from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone_number', 'whatsapp_number',
            'city', 'institute', 'address_area'
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Full profile serializer for the authenticated user themselves.
    """
    display_name = serializers.ReadOnlyField()
    active_listings_count = serializers.ReadOnlyField()
    sold_listings_count = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'display_name', 'phone_number', 'whatsapp_number',
            'city', 'institute', 'address_area', 'bio', 'avatar',
            'is_verified_seller', 'is_staff', 'is_superuser',
            'active_listings_count', 'sold_listings_count', 'date_joined'
        )
        read_only_fields = ('id', 'is_staff', 'is_superuser', 'is_verified_seller', 'date_joined')


class PublicSellerProfileSerializer(serializers.ModelSerializer):
    """
    Public seller profile serializer.
    DOES NOT EXPOSE private phone, WhatsApp or email.
    """
    display_name = serializers.ReadOnlyField()
    active_listings_count = serializers.ReadOnlyField()
    sold_listings_count = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'display_name', 'city', 'institute',
            'address_area', 'bio', 'avatar', 'is_verified_seller',
            'active_listings_count', 'sold_listings_count', 'date_joined'
        )
