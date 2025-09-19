"""
Web3 Integration Serializers for FinTech Banking API

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from rest_framework import serializers
from .models import SupportedNetwork, TokenContract, WalletBalance, SmartContractInteraction, DeFiPosition

class SupportedNetworkSerializer(serializers.ModelSerializer):
    """
    Serializer for supported blockchain networks.
    """
    class Meta:
        model = SupportedNetwork
        fields = [
            'id', 'name', 'chain_id', 'rpc_url', 'explorer_url',
            'native_currency', 'is_testnet', 'is_active'
        ]

class TokenContractSerializer(serializers.ModelSerializer):
    """
    Serializer for token contracts.
    """
    network_name = serializers.CharField(source='network.name', read_only=True)
    price_change_24h = serializers.DecimalField(max_digits=8, decimal_places=4, read_only=True)
    
    class Meta:
        model = TokenContract
        fields = [
            'id', 'network', 'network_name', 'contract_address', 'token_standard',
            'name', 'symbol', 'decimals', 'total_supply',
            'current_price_usd', 'market_cap', 'price_change_24h'
        ]

class WalletBalanceSerializer(serializers.ModelSerializer):
    """
    Serializer for wallet balances.
    """
    token_symbol = serializers.CharField(source='token.symbol', read_only=True)
    token_name = serializers.CharField(source='token.name', read_only=True)
    network_name = serializers.CharField(source='token.network.name', read_only=True)
    current_price = serializers.DecimalField(source='token.current_price_usd', max_digits=20, decimal_places=8, read_only=True)
    
    class Meta:
        model = WalletBalance
        fields = [
            'id', 'token', 'token_symbol', 'token_name', 'network_name',
            'wallet_address', 'balance', 'balance_usd', 'current_price', 'last_updated'
        ]

class SmartContractInteractionSerializer(serializers.ModelSerializer):
    """
    Serializer for smart contract interactions.
    """
    network_name = serializers.CharField(source='network.name', read_only=True)
    gas_cost_usd = serializers.SerializerMethodField()
    
    class Meta:
        model = SmartContractInteraction
        fields = [
            'id', 'contract_address', 'network', 'network_name', 'function_name',
            'interaction_type', 'transaction_hash', 'block_number',
            'gas_used', 'gas_price', 'gas_cost_usd', 'input_data', 'output_data',
            'status', 'error_message', 'created_at', 'confirmed_at'
        ]
        read_only_fields = [
            'id', 'transaction_hash', 'block_number', 'gas_used', 'gas_price',
            'output_data', 'status', 'error_message', 'created_at', 'confirmed_at'
        ]
    
    def get_gas_cost_usd(self, obj):
        """Calculate gas cost in USD."""
        if obj.gas_used and obj.gas_price:
            gas_cost_eth = (obj.gas_used * obj.gas_price) / 10**18
            eth_price_usd = 2400  # Simulated ETH price
            return round(gas_cost_eth * eth_price_usd, 2)
        return None

class DeFiPositionSerializer(serializers.ModelSerializer):
    """
    Serializer for DeFi positions.
    """
    token_in_symbol = serializers.CharField(source='token_in.symbol', read_only=True)
    token_out_symbol = serializers.CharField(source='token_out.symbol', read_only=True)
    network_name = serializers.CharField(source='network.name', read_only=True)
    profit_loss = serializers.DecimalField(max_digits=30, decimal_places=18, read_only=True)
    profit_loss_percentage = serializers.DecimalField(max_digits=8, decimal_places=4, read_only=True)
    
    class Meta:
        model = DeFiPosition
        fields = [
            'id', 'position_type', 'protocol_name', 'contract_address',
            'network', 'network_name', 'token_in', 'token_in_symbol',
            'token_out', 'token_out_symbol', 'amount_deposited', 'amount_current',
            'rewards_earned', 'profit_loss', 'profit_loss_percentage',
            'apy', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'profit_loss', 'profit_loss_percentage', 'created_at', 'updated_at'
        ]