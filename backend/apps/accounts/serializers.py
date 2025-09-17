"""
Account Serializers for FinTech Banking API

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
"""
Serializers for user accounts and Web3 authentication.
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Account, AccountLimit, UserPreference
import re

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with wallet integration.
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    wallet_signature = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password', 'password_confirm',
            'wallet_address', 'wallet_signature', 'phone', 'first_name', 'last_name'
        ]
        extra_kwargs = {
            'wallet_address': {'required': False},
            'phone': {'required': False},
        }
    
    def validate(self, attrs):
        """Validate password confirmation and wallet signature."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        # Validate wallet address format if provided
        wallet_address = attrs.get('wallet_address')
        if wallet_address:
            if not re.match(r'^0x[a-fA-F0-9]{40}$', wallet_address):
                raise serializers.ValidationError("Invalid wallet address format")
        
        return attrs
    
    def create(self, validated_data):
        """Create user with optional wallet verification."""
        validated_data.pop('password_confirm')
        wallet_signature = validated_data.pop('wallet_signature', None)
        
        user = User.objects.create_user(**validated_data)
        
        # If wallet signature is provided, verify it
        if wallet_signature and validated_data.get('wallet_address'):
            # TODO: Implement signature verification
            user.is_wallet_verified = True
            user.save()
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information.
    """
    total_accounts = serializers.IntegerField(read_only=True)
    total_balance_usd = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'phone',
            'wallet_address', 'is_wallet_verified', 'kyc_status', 'kyc_verified_at',
            'date_of_birth', 'address_line1', 'address_line2', 'city', 'state',
            'postal_code', 'country', 'is_premium', 'two_factor_enabled',
            'total_accounts', 'total_balance_usd', 'created_at', 'last_login'
        ]
        read_only_fields = [
            'id', 'email', 'wallet_address', 'is_wallet_verified', 
            'kyc_status', 'kyc_verified_at', 'is_premium', 'created_at', 'last_login'
        ]

class AccountSerializer(serializers.ModelSerializer):
    """
    Serializer for bank accounts with calculated fields.
    """
    total_balance = serializers.DecimalField(max_digits=20, decimal_places=8, read_only=True)
    balance_usd = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    account_age_days = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Account
        fields = [
            'id', 'account_number', 'account_type', 'currency',
            'available_balance', 'ledger_balance', 'pending_balance', 'total_balance',
            'balance_usd', 'is_active', 'is_frozen', 'freeze_reason',
            'interest_rate', 'monthly_fee', 'overdraft_limit',
            'contract_address', 'chain_id', 'account_age_days',
            'created_at', 'updated_at', 'last_transaction_at'
        ]
        read_only_fields = [
            'id', 'account_number', 'total_balance', 'balance_usd',
            'account_age_days', 'created_at', 'updated_at', 'last_transaction_at'
        ]

class AccountCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new accounts.
    """
    class Meta:
        model = Account
        fields = ['account_type', 'currency']
    
    def validate(self, attrs):
        """Validate account creation rules."""
        user = self.context['request'].user
        account_type = attrs['account_type']
        currency = attrs['currency']
        
        # Check if user already has this type of account in this currency
        if Account.objects.filter(
            user=user, 
            account_type=account_type, 
            currency=currency
        ).exists():
            raise serializers.ValidationError(
                f"You already have a {account_type} account in {currency}"
            )
        
        # Limit number of accounts per user
        if user.accounts.count() >= 10:
            raise serializers.ValidationError("Maximum number of accounts reached")
        
        return attrs
    
    def create(self, validated_data):
        """Create account for the authenticated user."""
        validated_data['user'] = self.context['request'].user
        return Account.objects.create(**validated_data)

class AccountLimitSerializer(serializers.ModelSerializer):
    """
    Serializer for account limits and restrictions.
    """
    remaining_limit = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    is_limit_exceeded = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = AccountLimit
        fields = [
            'id', 'limit_type', 'limit_amount', 'used_amount', 'remaining_limit',
            'is_limit_exceeded', 'reset_period', 'last_reset', 'created_at'
        ]
        read_only_fields = ['id', 'used_amount', 'last_reset', 'created_at']

class UserPreferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for user preferences and settings.
    """
    class Meta:
        model = UserPreference
        fields = [
            'theme', 'language', 'currency_display',
            'email_notifications', 'sms_notifications', 'push_notifications',
            'transaction_alerts', 'security_alerts', 'marketing_emails',
            'require_2fa_for_transfers', 'auto_logout_minutes', 'ip_whitelist',
            'default_slippage', 'auto_approve_small_transactions',
            'max_auto_approve_amount', 'updated_at'
        ]
        read_only_fields = ['updated_at']

class WalletConnectionSerializer(serializers.Serializer):
    """
    Serializer for connecting Web3 wallets.
    """
    wallet_address = serializers.CharField(max_length=42)
    signature = serializers.CharField()
    message = serializers.CharField()
    
    def validate_wallet_address(self, value):
        """Validate Ethereum address format."""
        if not re.match(r'^0x[a-fA-F0-9]{40}$', value):
            raise serializers.ValidationError("Invalid Ethereum address format")
        return value.lower()
    
    def validate(self, attrs):
        """Verify the wallet signature."""
        from web3 import Web3
        from eth_account.messages import encode_defunct
        
        try:
            message = attrs['message']
            signature = attrs['signature']
            wallet_address = attrs['wallet_address']
            
            # Create message hash
            message_hash = encode_defunct(text=message)
            
            # Recover address from signature
            recovered_address = Web3().eth.account.recover_message(
                message_hash, 
                signature=signature
            ).lower()
            
            if recovered_address != wallet_address:
                raise serializers.ValidationError("Signature verification failed")
            
        except Exception as e:
            raise serializers.ValidationError(f"Signature verification error: {str(e)}")
        
        return attrs

class LoginSerializer(serializers.Serializer):
    """
    Serializer for traditional and wallet-based authentication.
    """
    # Traditional login
    email = serializers.EmailField(required=False)
    password = serializers.CharField(required=False)
    
    # Wallet login
    wallet_address = serializers.CharField(required=False)
    signature = serializers.CharField(required=False)
    message = serializers.CharField(required=False)
    
    def validate(self, attrs):
        """Validate login credentials."""
        email = attrs.get('email')
        password = attrs.get('password')
        wallet_address = attrs.get('wallet_address')
        signature = attrs.get('signature')
        message = attrs.get('message')
        
        if email and password:
            # Traditional authentication
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled")
            attrs['user'] = user
            
        elif wallet_address and signature and message:
            # Wallet authentication
            wallet_serializer = WalletConnectionSerializer(data=attrs)
            wallet_serializer.is_valid(raise_exception=True)
            
            try:
                user = User.objects.get(wallet_address=wallet_address.lower())
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled")
                attrs['user'] = user
            except User.DoesNotExist:
                raise serializers.ValidationError("Wallet not registered")
        else:
            raise serializers.ValidationError("Either email/password or wallet credentials required")
        
        return attrs