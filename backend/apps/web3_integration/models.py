"""
Web3 Integration Models for FinTech Banking Platform

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from django.db import models
from decimal import Decimal
import uuid

class SupportedNetwork(models.Model):
    """
    Supported blockchain networks.
    """
    name = models.CharField(max_length=100)
    chain_id = models.IntegerField(unique=True)
    rpc_url = models.URLField()
    explorer_url = models.URLField()
    native_currency = models.CharField(max_length=10)
    is_testnet = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'supported_networks'
    
    def __str__(self):
        return f"{self.name} ({'Testnet' if self.is_testnet else 'Mainnet'})"

class TokenContract(models.Model):
    """
    Supported token contracts.
    """
    TOKEN_STANDARDS = [
        ('ERC20', 'ERC-20'),
        ('ERC721', 'ERC-721 (NFT)'),
        ('ERC1155', 'ERC-1155'),
    ]
    
    network = models.ForeignKey(SupportedNetwork, on_delete=models.CASCADE, related_name='tokens')
    contract_address = models.CharField(max_length=42)
    token_standard = models.CharField(max_length=10, choices=TOKEN_STANDARDS)
    
    # Token metadata
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=20)
    decimals = models.IntegerField(default=18)
    total_supply = models.DecimalField(max_digits=30, decimal_places=0, null=True, blank=True)
    
    # Market data
    current_price_usd = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    market_cap = models.DecimalField(max_digits=30, decimal_places=2, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'token_contracts'
        unique_together = [['network', 'contract_address']]
    
    def __str__(self):
        return f"{self.symbol} ({self.name})"

class WalletBalance(models.Model):
    """
    User wallet balances for different tokens.
    """
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='wallet_balances')
    token = models.ForeignKey(TokenContract, on_delete=models.CASCADE)
    wallet_address = models.CharField(max_length=42)
    
    balance = models.DecimalField(max_digits=30, decimal_places=18)
    balance_usd = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'wallet_balances'
        unique_together = [['user', 'token', 'wallet_address']]
    
    def __str__(self):
        return f"{self.user.email} - {self.balance} {self.token.symbol}"

class SmartContractInteraction(models.Model):
    """
    Track smart contract interactions.
    """
    INTERACTION_TYPES = [
        ('transfer', 'Token Transfer'),
        ('approve', 'Token Approval'),
        ('swap', 'Token Swap'),
        ('stake', 'Staking'),
        ('unstake', 'Unstaking'),
        ('mint', 'Minting'),
        ('burn', 'Burning'),
        ('custom', 'Custom Function Call'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='contract_interactions')
    
    # Contract details
    contract_address = models.CharField(max_length=42)
    network = models.ForeignKey(SupportedNetwork, on_delete=models.CASCADE)
    function_name = models.CharField(max_length=100)
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES)
    
    # Transaction details
    transaction_hash = models.CharField(max_length=66, unique=True)
    block_number = models.BigIntegerField(null=True, blank=True)
    gas_used = models.BigIntegerField(null=True, blank=True)
    gas_price = models.BigIntegerField(null=True, blank=True)
    
    # Input/output data
    input_data = models.JSONField(default=dict)
    output_data = models.JSONField(default=dict, blank=True)
    
    # Status
    status = models.CharField(max_length=20, default='pending')
    error_message = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'smart_contract_interactions'
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['transaction_hash']),
            models.Index(fields=['contract_address', 'function_name']),
        ]
    
    def __str__(self):
        return f"{self.function_name} on {self.contract_address[:10]}..."

class DeFiPosition(models.Model):
    """
    Track user's DeFi positions and yields.
    """
    POSITION_TYPES = [
        ('liquidity_pool', 'Liquidity Pool'),
        ('lending', 'Lending'),
        ('borrowing', 'Borrowing'),
        ('staking', 'Staking'),
        ('farming', 'Yield Farming'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='defi_positions')
    
    # Position details
    position_type = models.CharField(max_length=20, choices=POSITION_TYPES)
    protocol_name = models.CharField(max_length=100)
    contract_address = models.CharField(max_length=42)
    network = models.ForeignKey(SupportedNetwork, on_delete=models.CASCADE)
    
    # Token information
    token_in = models.ForeignKey(TokenContract, on_delete=models.CASCADE, related_name='positions_in')
    token_out = models.ForeignKey(TokenContract, on_delete=models.CASCADE, related_name='positions_out', null=True, blank=True)
    
    # Position amounts
    amount_deposited = models.DecimalField(max_digits=30, decimal_places=18)
    amount_current = models.DecimalField(max_digits=30, decimal_places=18)
    rewards_earned = models.DecimalField(max_digits=30, decimal_places=18, default=Decimal('0'))
    
    # Yield information
    apy = models.DecimalField(max_digits=8, decimal_places=4, null=True, blank=True)  # Annual Percentage Yield
    
    # Status
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'defi_positions'
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['protocol_name', 'position_type']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.protocol_name} {self.position_type}"
    
    @property
    def profit_loss(self):
        """Calculate profit/loss for the position."""
        return self.amount_current + self.rewards_earned - self.amount_deposited
    
    @property
    def profit_loss_percentage(self):
        """Calculate profit/loss percentage."""
        if self.amount_deposited == 0:
            return Decimal('0')
        return (self.profit_loss / self.amount_deposited) * 100