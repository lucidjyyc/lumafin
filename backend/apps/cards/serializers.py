"""
Card Serializers for FinTech Banking API

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from rest_framework import serializers
from .models import Card, CardTransaction
from apps.accounts.models import Account

class CardSerializer(serializers.ModelSerializer):
    """
    Serializer for card data with security considerations.
    """
    masked_card_number = serializers.SerializerMethodField()
    remaining_limit = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    is_limit_exceeded = serializers.BooleanField(read_only=True)
    account_name = serializers.CharField(source='account.account_type', read_only=True)
    
    class Meta:
        model = Card
        fields = [
            'id', 'account', 'account_name', 'card_type', 'status', 'nickname',
            'masked_card_number', 'expiry_month', 'expiry_year',
            'spending_limit', 'spent_amount', 'remaining_limit', 'is_limit_exceeded',
            'merchant_name', 'usage_count', 'max_usage_count',
            'is_contactless_enabled', 'is_online_enabled', 'is_international_enabled',
            'created_at', 'updated_at', 'last_used_at', 'expires_at'
        ]
        read_only_fields = [
            'id', 'masked_card_number', 'spent_amount', 'usage_count',
            'remaining_limit', 'is_limit_exceeded', 'created_at', 'updated_at', 'last_used_at'
        ]
    
    def get_masked_card_number(self, obj):
        """Return masked card number for security."""
        if obj.card_number:
            return f"•••• •••• •••• {obj.card_number[-4:]}"
        return "•••• •••• •••• ••••"

class CardCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new cards.
    """
    class Meta:
        model = Card
        fields = ['account', 'card_type', 'nickname']
    
    def validate_account(self, value):
        """Validate account ownership."""
        user = self.context['request'].user
        if value.user != user:
            raise serializers.ValidationError("You don't own this account")
        return value

class VirtualCardCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating virtual cards with specific parameters.
    """
    class Meta:
        model = Card
        fields = [
            'card_type', 'nickname', 'spending_limit', 'merchant_name',
            'max_usage_count', 'expires_at'
        ]
    
    def validate_card_type(self, value):
        """Ensure only virtual card types are allowed."""
        virtual_types = ['virtual', 'virtual_single_use', 'virtual_merchant_locked', 'virtual_subscription']
        if value not in virtual_types:
            raise serializers.ValidationError("Only virtual card types are allowed")
        return value
    
    def validate(self, attrs):
        """Validate virtual card creation rules."""
        card_type = attrs['card_type']
        
        # Merchant-locked cards require merchant name
        if card_type == 'virtual_merchant_locked' and not attrs.get('merchant_name'):
            raise serializers.ValidationError("Merchant name is required for merchant-locked cards")
        
        # Single-use cards should have usage limit of 1
        if card_type == 'virtual_single_use':
            attrs['max_usage_count'] = 1
        
        return attrs

class CardTransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for card transactions.
    """
    transaction_amount = serializers.DecimalField(source='transaction.amount', max_digits=20, decimal_places=8, read_only=True)
    transaction_currency = serializers.CharField(source='transaction.currency', read_only=True)
    transaction_status = serializers.CharField(source='transaction.status', read_only=True)
    
    class Meta:
        model = CardTransaction
        fields = [
            'id', 'card', 'transaction', 'merchant_name', 'merchant_category',
            'merchant_location', 'authorization_code', 'processor_response',
            'transaction_amount', 'transaction_currency', 'transaction_status',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']