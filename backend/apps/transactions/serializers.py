"""
Transaction Serializers for FinTech Banking API

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from rest_framework import serializers
from decimal import Decimal
from .models import Transaction, TransactionCategory, RecurringTransaction, TransactionDispute
from apps.accounts.models import Account

class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for transaction data with calculated fields.
    """
    net_amount = serializers.DecimalField(max_digits=20, decimal_places=8, read_only=True)
    is_blockchain_transaction = serializers.BooleanField(read_only=True)
    from_account_name = serializers.CharField(source='from_account.account_type', read_only=True)
    to_account_name = serializers.CharField(source='to_account.account_type', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'from_account', 'to_account', 'transaction_type', 'status',
            'amount', 'currency', 'fee_amount', 'exchange_rate', 'net_amount',
            'reference_number', 'description', 'external_reference',
            'blockchain_hash', 'block_number', 'gas_used', 'gas_price',
            'contract_address', 'chain_id', 'risk_score', 'is_flagged',
            'compliance_status', 'is_blockchain_transaction',
            'from_account_name', 'to_account_name',
            'created_at', 'updated_at', 'processed_at', 'settled_at'
        ]
        read_only_fields = [
            'id', 'reference_number', 'net_amount', 'is_blockchain_transaction',
            'from_account_name', 'to_account_name', 'created_at', 'updated_at'
        ]

class TransactionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new transactions.
    """
    class Meta:
        model = Transaction
        fields = [
            'from_account', 'to_account', 'transaction_type',
            'amount', 'currency', 'description', 'external_reference'
        ]
    
    def validate(self, attrs):
        """Validate transaction creation rules."""
        from_account = attrs.get('from_account')
        to_account = attrs.get('to_account')
        amount = attrs['amount']
        
        # Check account ownership
        user = self.context['request'].user
        if from_account and from_account.user != user:
            raise serializers.ValidationError("You don't own the source account")
        
        # Check sufficient funds
        if from_account and from_account.available_balance < amount:
            raise serializers.ValidationError("Insufficient funds")
        
        # Validate amount
        if amount <= 0:
            raise serializers.ValidationError("Amount must be positive")
        
        return attrs
    
    def create(self, validated_data):
        """Create transaction with business logic."""
        transaction = Transaction.objects.create(**validated_data)
        
        # Process the transaction
        self._process_transaction(transaction)
        
        return transaction
    
    def _process_transaction(self, transaction):
        """Process transaction and update account balances."""
        if transaction.from_account:
            # Deduct from source account
            transaction.from_account.available_balance -= transaction.amount
            transaction.from_account.save()
        
        if transaction.to_account:
            # Add to destination account
            transaction.to_account.available_balance += transaction.amount
            transaction.to_account.save()
        
        # Update transaction status
        transaction.status = 'completed'
        transaction.processed_at = timezone.now()
        transaction.save()

class TransactionCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for transaction categories.
    """
    transaction_count = serializers.IntegerField(read_only=True)
    total_amount = serializers.DecimalField(max_digits=20, decimal_places=8, read_only=True)
    
    class Meta:
        model = TransactionCategory
        fields = [
            'id', 'name', 'description', 'parent', 'icon', 'color',
            'keywords', 'merchant_patterns', 'transaction_count', 'total_amount',
            'created_at', 'updated_at'
        ]

class RecurringTransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for recurring transactions.
    """
    next_execution_date = serializers.DateTimeField(source='next_execution', read_only=True)
    
    class Meta:
        model = RecurringTransaction
        fields = [
            'id', 'from_account', 'to_account', 'transaction_type',
            'amount', 'currency', 'description', 'category',
            'frequency', 'start_date', 'end_date', 'next_execution_date',
            'is_active', 'execution_count', 'max_executions',
            'last_executed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'execution_count', 'last_executed', 'created_at', 'updated_at']

class TransactionDisputeSerializer(serializers.ModelSerializer):
    """
    Serializer for transaction disputes.
    """
    class Meta:
        model = TransactionDispute
        fields = [
            'id', 'transaction', 'reason', 'status', 'description',
            'evidence_urls', 'resolution', 'resolved_by', 'resolved_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'transaction', 'resolved_by', 'resolved_at', 'created_at', 'updated_at'
        ]