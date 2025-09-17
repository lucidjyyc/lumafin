"""
User and Account Models for FinTech Banking Platform

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
"""
User and Account models for the fintech banking system.
Supports both traditional banking and Web3 wallet integration.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
import uuid
from decimal import Decimal

class User(AbstractUser):
    """
    Extended user model with fintech-specific fields and Web3 integration.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Web3 Integration
    wallet_address = models.CharField(max_length=42, unique=True, blank=True, null=True)
    is_wallet_verified = models.BooleanField(default=False)
    
    # KYC/AML Compliance
    kyc_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('verified', 'Verified'),
            ('rejected', 'Rejected'),
            ('expired', 'Expired'),
        ],
        default='pending'
    )
    kyc_verified_at = models.DateTimeField(null=True, blank=True)
    
    # Profile Information
    date_of_birth = models.DateField(null=True, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    # Account Settings
    is_premium = models.BooleanField(default=False)
    notification_preferences = models.JSONField(default=dict, blank=True)
    two_factor_enabled = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['wallet_address']),
            models.Index(fields=['email']),
            models.Index(fields=['kyc_status']),
        ]
    
    def __str__(self):
        return f"{self.email} ({self.wallet_address or 'No Wallet'})"

class Account(models.Model):
    """
    Banking account model supporting multiple currencies and account types.
    """
    ACCOUNT_TYPES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
        ('investment', 'Investment'),
        ('crypto', 'Cryptocurrency'),
        ('business', 'Business'),
    ]
    
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
        ('ETH', 'Ethereum'),
        ('BTC', 'Bitcoin'),
        ('USDC', 'USD Coin'),
        ('USDT', 'Tether'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    
    # Account Details
    account_number = models.CharField(max_length=20, unique=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='USD')
    
    # Balances
    available_balance = models.DecimalField(max_digits=20, decimal_places=8, default=Decimal('0'))
    ledger_balance = models.DecimalField(max_digits=20, decimal_places=8, default=Decimal('0'))
    pending_balance = models.DecimalField(max_digits=20, decimal_places=8, default=Decimal('0'))
    
    # Account Status
    is_active = models.BooleanField(default=True)
    is_frozen = models.BooleanField(default=False)
    freeze_reason = models.TextField(blank=True)
    
    # Interest and Fees
    interest_rate = models.DecimalField(max_digits=5, decimal_places=4, default=Decimal('0'))
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0'))
    overdraft_limit = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0'))
    
    # Web3 Integration
    contract_address = models.CharField(max_length=42, blank=True, null=True)
    chain_id = models.IntegerField(default=1)  # Ethereum mainnet by default
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_transaction_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'accounts'
        unique_together = [['user', 'account_type', 'currency']]
        indexes = [
            models.Index(fields=['account_number']),
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['currency', 'account_type']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.account_type.title()} ({self.currency})"
    
    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = self.generate_account_number()
        super().save(*args, **kwargs)
    
    def generate_account_number(self):
        """Generate a unique account number."""
        import random
        import string
        
        prefix = {
            'checking': '101',
            'savings': '201',
            'investment': '301',
            'crypto': '401',
            'business': '501',
        }.get(self.account_type, '999')
        
        suffix = ''.join(random.choices(string.digits, k=10))
        return f"{prefix}{suffix}"

class AccountLimit(models.Model):
    """
    Account limits and restrictions for compliance and risk management.
    """
    LIMIT_TYPES = [
        ('daily_withdraw', 'Daily Withdrawal'),
        ('daily_deposit', 'Daily Deposit'),
        ('monthly_transfer', 'Monthly Transfer'),
        ('transaction_count', 'Transaction Count'),
        ('single_transaction', 'Single Transaction'),
    ]
    
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='limits')
    limit_type = models.CharField(max_length=30, choices=LIMIT_TYPES)
    limit_amount = models.DecimalField(max_digits=15, decimal_places=2)
    used_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    reset_period = models.CharField(max_length=20, default='daily')  # daily, weekly, monthly
    last_reset = models.DateTimeField(auto_now_add=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'account_limits'
        unique_together = [['account', 'limit_type']]
    
    @property
    def remaining_limit(self):
        return self.limit_amount - self.used_amount
    
    @property
    def is_limit_exceeded(self):
        return self.used_amount >= self.limit_amount

class UserPreference(models.Model):
    """
    User preferences and settings for personalization.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    
    # UI Preferences
    theme = models.CharField(max_length=20, default='dark')
    language = models.CharField(max_length=10, default='en')
    currency_display = models.CharField(max_length=10, default='USD')
    
    # Notification Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    transaction_alerts = models.BooleanField(default=True)
    security_alerts = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)
    
    # Security Preferences
    require_2fa_for_transfers = models.BooleanField(default=False)
    auto_logout_minutes = models.IntegerField(default=30)
    ip_whitelist = models.JSONField(default=list, blank=True)
    
    # Trading Preferences
    default_slippage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.5'))
    auto_approve_small_transactions = models.BooleanField(default=False)
    max_auto_approve_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('100'))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_preferences'