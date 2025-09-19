"""
Card Models for FinTech Banking Platform

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from django.db import models
from decimal import Decimal
import uuid
import random
import string

class Card(models.Model):
    """
    Physical and virtual card management.
    """
    CARD_TYPES = [
        ('physical', 'Physical Card'),
        ('virtual', 'Virtual Card'),
        ('virtual_single_use', 'Single-Use Virtual Card'),
        ('virtual_merchant_locked', 'Merchant-Locked Virtual Card'),
        ('virtual_subscription', 'Subscription Virtual Card'),
    ]
    
    CARD_STATUS = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('blocked', 'Blocked'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE, related_name='cards')
    
    # Card details
    card_number = models.CharField(max_length=19, unique=True)  # Formatted: 1234 5678 9012 3456
    card_number_encrypted = models.TextField()  # Encrypted storage
    expiry_month = models.IntegerField()
    expiry_year = models.IntegerField()
    cvv = models.CharField(max_length=4)
    cvv_encrypted = models.TextField()  # Encrypted storage
    
    # Card metadata
    card_type = models.CharField(max_length=30, choices=CARD_TYPES)
    status = models.CharField(max_length=20, choices=CARD_STATUS, default='active')
    nickname = models.CharField(max_length=100, blank=True)
    
    # Virtual card specific
    spending_limit = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    spent_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    merchant_name = models.CharField(max_length=200, blank=True)  # For merchant-locked cards
    usage_count = models.IntegerField(default=0)
    max_usage_count = models.IntegerField(null=True, blank=True)  # For limited-use cards
    
    # Security
    is_contactless_enabled = models.BooleanField(default=True)
    is_online_enabled = models.BooleanField(default=True)
    is_international_enabled = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # For temporary virtual cards
    
    class Meta:
        db_table = 'cards'
        indexes = [
            models.Index(fields=['account', 'status']),
            models.Index(fields=['card_type', 'status']),
        ]
    
    def __str__(self):
        return f"{self.nickname or self.card_type.title()} - {self.card_number[-4:]}"
    
    def save(self, *args, **kwargs):
        if not self.card_number:
            self.card_number = self.generate_card_number()
        if not self.cvv:
            self.cvv = self.generate_cvv()
        super().save(*args, **kwargs)
    
    def generate_card_number(self):
        """Generate a valid card number using Luhn algorithm."""
        # Start with BIN (Bank Identification Number)
        bin_number = "4532"  # Visa test BIN
        
        # Generate random digits
        account_identifier = ''.join(random.choices(string.digits, k=11))
        
        # Calculate check digit using Luhn algorithm
        partial_number = bin_number + account_identifier
        check_digit = self.calculate_luhn_check_digit(partial_number)
        
        full_number = partial_number + str(check_digit)
        
        # Format with spaces
        return f"{full_number[:4]} {full_number[4:8]} {full_number[8:12]} {full_number[12:]}"
    
    def generate_cvv(self):
        """Generate random CVV."""
        return ''.join(random.choices(string.digits, k=3))
    
    def calculate_luhn_check_digit(self, partial_number):
        """Calculate Luhn check digit."""
        def luhn_checksum(card_num):
            def digits_of(n):
                return [int(d) for d in str(n)]
            digits = digits_of(card_num)
            odd_digits = digits[-1::-2]
            even_digits = digits[-2::-2]
            checksum = sum(odd_digits)
            for d in even_digits:
                checksum += sum(digits_of(d*2))
            return checksum % 10
        
        return (10 - luhn_checksum(int(partial_number))) % 10
    
    @property
    def remaining_limit(self):
        """Calculate remaining spending limit."""
        if not self.spending_limit:
            return None
        return self.spending_limit - self.spent_amount
    
    @property
    def is_limit_exceeded(self):
        """Check if spending limit is exceeded."""
        if not self.spending_limit:
            return False
        return self.spent_amount >= self.spending_limit

class CardTransaction(models.Model):
    """
    Card-specific transaction tracking.
    """
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='transactions')
    transaction = models.ForeignKey('transactions.Transaction', on_delete=models.CASCADE)
    
    # Merchant details
    merchant_name = models.CharField(max_length=200)
    merchant_category = models.CharField(max_length=100, blank=True)
    merchant_location = models.CharField(max_length=200, blank=True)
    
    # Authorization details
    authorization_code = models.CharField(max_length=20, blank=True)
    processor_response = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'card_transactions'