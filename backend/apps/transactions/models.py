"""
Transaction Models for FinTech Banking Platform

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
"""
Transaction models for comprehensive financial tracking.
Supports both traditional banking and Web3 transactions.
"""

from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from decimal import Decimal
import uuid

class Transaction(models.Model):
    """
    Core transaction model supporting multiple transaction types and currencies.
    """
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
        ('payment', 'Payment'),
        ('exchange', 'Currency Exchange'),
        ('fee', 'Fee'),
        ('interest', 'Interest'),
        ('dividend', 'Dividend'),
        ('loan_payment', 'Loan Payment'),
        ('card_payment', 'Card Payment'),
        ('crypto_buy', 'Crypto Purchase'),
        ('crypto_sell', 'Crypto Sale'),
        ('defi_stake', 'DeFi Staking'),
        ('defi_unstake', 'DeFi Unstaking'),
        ('nft_purchase', 'NFT Purchase'),
        ('nft_sale', 'NFT Sale'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('disputed', 'Disputed'),
        ('refunded', 'Refunded'),
    ]
    
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
        ('ETH', 'Ethereum'),
        ('BTC', 'Bitcoin'),
        ('USDC', 'USD Coin'),
        ('USDT', 'Tether'),
        ('DAI', 'Dai'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Core transaction details
    from_account = models.ForeignKey(
        'accounts.Account', 
        on_delete=models.CASCADE, 
        related_name='outgoing_transactions',
        null=True, blank=True
    )
    to_account = models.ForeignKey(
        'accounts.Account', 
        on_delete=models.CASCADE, 
        related_name='incoming_transactions',
        null=True, blank=True
    )
    
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Amount and currency
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES)
    fee_amount = models.DecimalField(max_digits=20, decimal_places=8, default=Decimal('0'))
    exchange_rate = models.DecimalField(max_digits=20, decimal_places=8, default=Decimal('1'))
    
    # Transaction metadata
    reference_number = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.TextField(blank=True)
    external_reference = models.CharField(max_length=100, blank=True, db_index=True)
    
    # Web3 specific fields
    blockchain_hash = models.CharField(max_length=66, blank=True, db_index=True)
    block_number = models.BigIntegerField(null=True, blank=True)
    gas_used = models.BigIntegerField(null=True, blank=True)
    gas_price = models.BigIntegerField(null=True, blank=True)
    contract_address = models.CharField(max_length=42, blank=True)
    chain_id = models.IntegerField(default=1)
    
    # Risk and compliance
    risk_score = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0'))
    is_flagged = models.BooleanField(default=False)
    compliance_status = models.CharField(max_length=20, default='cleared')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    settled_at = models.DateTimeField(null=True, blank=True)
    
    # Generic relation for linking to other models
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object = GenericForeignKey('content_type', 'object_id')
    
    class Meta:
        db_table = 'transactions'
        indexes = [
            models.Index(fields=['reference_number']),
            models.Index(fields=['blockchain_hash']),
            models.Index(fields=['external_reference']),
            models.Index(fields=['created_at', 'status']),
            models.Index(fields=['from_account', 'created_at']),
            models.Index(fields=['to_account', 'created_at']),
            models.Index(fields=['transaction_type', 'currency']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.transaction_type.title()} - {self.amount} {self.currency} ({self.status})"
    
    def save(self, *args, **kwargs):
        if not self.reference_number:
            self.reference_number = self.generate_reference_number()
        super().save(*args, **kwargs)
    
    def generate_reference_number(self):
        """Generate unique reference number for the transaction."""
        import random
        import string
        from django.utils import timezone
        
        timestamp = timezone.now().strftime('%Y%m%d')
        random_suffix = ''.join(random.choices(string.digits, k=8))
        return f"TXN{timestamp}{random_suffix}"
    
    @property
    def net_amount(self):
        """Calculate net amount including fees."""
        return self.amount - self.fee_amount
    
    @property
    def is_blockchain_transaction(self):
        """Check if this is a blockchain transaction."""
        return bool(self.blockchain_hash)

class TransactionCategory(models.Model):
    """
    Categories for transaction organization and budgeting.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color code
    is_active = models.BooleanField(default=True)
    
    # Auto-categorization rules
    keywords = models.JSONField(default=list, blank=True)
    merchant_patterns = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction_categories'
        verbose_name_plural = 'Transaction Categories'
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name

class TransactionTag(models.Model):
    """
    Tags for flexible transaction labeling and filtering.
    """
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='tags')
    category = models.ForeignKey(TransactionCategory, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=50)
    value = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'transaction_tags'
        unique_together = [['transaction', 'name']]
    
    def __str__(self):
        if self.value:
            return f"{self.name}: {self.value}"
        return self.name

class RecurringTransaction(models.Model):
    """
    Template for recurring transactions (subscriptions, salaries, etc.).
    """
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('biweekly', 'Bi-weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='recurring_transactions')
    
    # Transaction template
    from_account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE, related_name='recurring_outgoing')
    to_account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE, related_name='recurring_incoming', null=True, blank=True)
    
    transaction_type = models.CharField(max_length=20, choices=Transaction.TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    currency = models.CharField(max_length=10, choices=Transaction.CURRENCY_CHOICES)
    description = models.TextField(blank=True)
    category = models.ForeignKey(TransactionCategory, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Recurrence settings
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    next_execution = models.DateTimeField()
    
    # Status and control
    is_active = models.BooleanField(default=True)
    execution_count = models.IntegerField(default=0)
    max_executions = models.IntegerField(null=True, blank=True)
    
    # Last execution tracking
    last_executed = models.DateTimeField(null=True, blank=True)
    last_transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recurring_transactions'
        indexes = [
            models.Index(fields=['next_execution', 'is_active']),
            models.Index(fields=['user', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.description or self.transaction_type.title()} - {self.frequency}"
    
    def calculate_next_execution(self):
        """Calculate the next execution date based on frequency."""
        from datetime import timedelta
        from dateutil.relativedelta import relativedelta
        
        if not self.last_executed:
            return self.next_execution
        
        if self.frequency == 'daily':
            return self.last_executed + timedelta(days=1)
        elif self.frequency == 'weekly':
            return self.last_executed + timedelta(weeks=1)
        elif self.frequency == 'biweekly':
            return self.last_executed + timedelta(weeks=2)
        elif self.frequency == 'monthly':
            return self.last_executed + relativedelta(months=1)
        elif self.frequency == 'quarterly':
            return self.last_executed + relativedelta(months=3)
        elif self.frequency == 'yearly':
            return self.last_executed + relativedelta(years=1)
        
        return self.next_execution

class TransactionLimit(models.Model):
    """
    Daily/monthly transaction limits for accounts and users.
    """
    LIMIT_TYPES = [
        ('daily_amount', 'Daily Amount'),
        ('daily_count', 'Daily Count'),
        ('monthly_amount', 'Monthly Amount'),
        ('monthly_count', 'Monthly Count'),
        ('single_transaction', 'Single Transaction'),
    ]
    
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='transaction_limits')
    account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE, null=True, blank=True)
    transaction_type = models.CharField(max_length=20, choices=Transaction.TRANSACTION_TYPES, blank=True)
    
    limit_type = models.CharField(max_length=30, choices=LIMIT_TYPES)
    limit_value = models.DecimalField(max_digits=15, decimal_places=2)
    used_value = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    
    reset_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction_limits'
        unique_together = [['user', 'account', 'transaction_type', 'limit_type']]
    
    @property
    def remaining_limit(self):
        return self.limit_value - self.used_value
    
    @property
    def is_exceeded(self):
        return self.used_value >= self.limit_value

class TransactionDispute(models.Model):
    """
    Dispute management for transactions.
    """
    DISPUTE_REASONS = [
        ('unauthorized', 'Unauthorized Transaction'),
        ('duplicate', 'Duplicate Charge'),
        ('not_received', 'Service/Product Not Received'),
        ('defective', 'Defective Product/Service'),
        ('incorrect_amount', 'Incorrect Amount'),
        ('fraud', 'Fraudulent Transaction'),
        ('other', 'Other'),
    ]
    
    DISPUTE_STATUS = [
        ('open', 'Open'),
        ('investigating', 'Under Investigation'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
        ('closed', 'Closed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='dispute')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='disputes')
    
    reason = models.CharField(max_length=20, choices=DISPUTE_REASONS)
    status = models.CharField(max_length=20, choices=DISPUTE_STATUS, default='open')
    description = models.TextField()
    evidence_urls = models.JSONField(default=list, blank=True)
    
    # Resolution details
    resolution = models.TextField(blank=True)
    resolved_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_disputes')
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction_disputes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Dispute #{self.id.hex[:8]} - {self.reason.title()}"