"""
Web3 Integration API Views for FinTech Banking Platform

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from web3 import Web3
from .models import SupportedNetwork, TokenContract, WalletBalance, SmartContractInteraction, DeFiPosition
from .serializers import (
    SupportedNetworkSerializer, TokenContractSerializer, WalletBalanceSerializer,
    SmartContractInteractionSerializer, DeFiPositionSerializer
)

class Web3ViewSet(viewsets.ViewSet):
    """
    ViewSet for Web3 operations and blockchain interactions.
    """
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def networks(self, request):
        """Get supported blockchain networks."""
        networks = SupportedNetwork.objects.filter(is_active=True)
        serializer = SupportedNetworkSerializer(networks, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def balances(self, request):
        """Get user's wallet balances across all networks."""
        wallet_address = request.query_params.get('wallet_address')
        
        if not wallet_address:
            # Use user's connected wallet
            if not request.user.wallet_address:
                return Response({
                    'error': {
                        'code': 'NO_WALLET_CONNECTED',
                        'message': 'No wallet address provided or connected'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            wallet_address = request.user.wallet_address
        
        # Get balances from database
        balances = WalletBalance.objects.filter(
            user=request.user,
            wallet_address=wallet_address.lower()
        ).select_related('token', 'token__network')
        
        serializer = WalletBalanceSerializer(balances, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def refresh_balances(self, request):
        """Refresh wallet balances from blockchain."""
        wallet_address = request.data.get('wallet_address')
        
        if not wallet_address:
            wallet_address = request.user.wallet_address
        
        if not wallet_address:
            return Response({
                'error': {
                    'code': 'NO_WALLET_ADDRESS',
                    'message': 'Wallet address is required'
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Refresh balances for all supported tokens
        updated_balances = self._refresh_wallet_balances(request.user, wallet_address)
        
        return Response({
            'success': True,
            'data': {
                'updated_count': len(updated_balances),
                'wallet_address': wallet_address,
                'last_updated': timezone.now()
            }
        })
    
    @action(detail=False, methods=['post'])
    def send_transaction(self, request):
        """Send a blockchain transaction."""
        data = request.data
        
        # Validate required fields
        required_fields = ['to_address', 'amount', 'network_id']
        for field in required_fields:
            if field not in data:
                return Response({
                    'error': {
                        'code': 'MISSING_FIELD',
                        'message': f'Field {field} is required'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get network
            network = SupportedNetwork.objects.get(
                chain_id=data['network_id'],
                is_active=True
            )
            
            # Create Web3 instance
            w3 = Web3(Web3.HTTPProvider(network.rpc_url))
            
            # Build transaction
            transaction_data = {
                'to': data['to_address'],
                'value': w3.to_wei(data['amount'], 'ether'),
                'gas': data.get('gas_limit', 21000),
                'gasPrice': w3.to_wei(data.get('gas_price', 20), 'gwei'),
                'nonce': w3.eth.get_transaction_count(request.user.wallet_address),
            }
            
            # For demo purposes, we'll simulate the transaction
            # In production, this would require private key signing
            simulated_hash = f"0x{''.join([f'{i:02x}' for i in range(32)])}"
            
            # Record the interaction
            interaction = SmartContractInteraction.objects.create(
                user=request.user,
                contract_address=data['to_address'],
                network=network,
                function_name='transfer',
                interaction_type='transfer',
                transaction_hash=simulated_hash,
                input_data=data,
                status='pending'
            )
            
            return Response({
                'success': True,
                'data': {
                    'transaction_hash': simulated_hash,
                    'interaction_id': interaction.id,
                    'status': 'pending',
                    'estimated_confirmation_time': '2-5 minutes'
                }
            })
            
        except SupportedNetwork.DoesNotExist:
            return Response({
                'error': {
                    'code': 'UNSUPPORTED_NETWORK',
                    'message': 'Network not supported'
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': {
                    'code': 'TRANSACTION_FAILED',
                    'message': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _refresh_wallet_balances(self, user, wallet_address):
        """Refresh balances from blockchain (simplified for demo)."""
        # In production, this would query actual blockchain nodes
        updated_balances = []
        
        tokens = TokenContract.objects.filter(is_active=True)
        for token in tokens:
            # Simulate balance fetching
            simulated_balance = Decimal('1000.123456789012345678')  # Demo balance
            
            balance, created = WalletBalance.objects.update_or_create(
                user=user,
                token=token,
                wallet_address=wallet_address.lower(),
                defaults={
                    'balance': simulated_balance,
                    'balance_usd': simulated_balance * (token.current_price_usd or Decimal('1'))
                }
            )
            updated_balances.append(balance)
        
        return updated_balances

class DeFiViewSet(viewsets.ModelViewSet):
    """
    ViewSet for DeFi positions and yield farming.
    """
    serializer_class = DeFiPositionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return DeFiPosition.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def protocols(self, request):
        """Get available DeFi protocols."""
        protocols = [
            {
                'name': 'Uniswap V3',
                'type': 'DEX',
                'tvl': '4.2B',
                'apy_range': '0.1% - 500%',
                'supported_tokens': ['ETH', 'USDC', 'USDT', 'DAI']
            },
            {
                'name': 'Aave',
                'type': 'Lending',
                'tvl': '6.8B',
                'apy_range': '0.5% - 15%',
                'supported_tokens': ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC']
            },
            {
                'name': 'Compound',
                'type': 'Lending',
                'tvl': '2.1B',
                'apy_range': '0.3% - 12%',
                'supported_tokens': ['ETH', 'USDC', 'USDT', 'DAI']
            }
        ]
        
        return Response({
            'success': True,
            'data': protocols
        })
    
    @action(detail=False, methods=['post'])
    def stake(self, request):
        """Stake tokens in a DeFi protocol."""
        data = request.data
        
        # Validate staking data
        required_fields = ['protocol_name', 'token_address', 'amount']
        for field in required_fields:
            if field not in data:
                return Response({
                    'error': {
                        'code': 'MISSING_FIELD',
                        'message': f'Field {field} is required'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get token contract
            token = TokenContract.objects.get(contract_address=data['token_address'])
            
            # Create DeFi position
            position = DeFiPosition.objects.create(
                user=request.user,
                position_type='staking',
                protocol_name=data['protocol_name'],
                contract_address=data['token_address'],
                network=token.network,
                token_in=token,
                amount_deposited=data['amount'],
                amount_current=data['amount'],
                apy=data.get('apy', Decimal('5.0'))
            )
            
            return Response({
                'success': True,
                'data': DeFiPositionSerializer(position).data
            }, status=status.HTTP_201_CREATED)
            
        except TokenContract.DoesNotExist:
            return Response({
                'error': {
                    'code': 'TOKEN_NOT_FOUND',
                    'message': 'Token contract not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_gas_prices(request):
    """Get current gas prices for supported networks."""
    gas_prices = {}
    
    networks = SupportedNetwork.objects.filter(is_active=True)
    for network in networks:
        try:
            w3 = Web3(Web3.HTTPProvider(network.rpc_url))
            gas_price = w3.eth.gas_price
            
            gas_prices[network.name] = {
                'chain_id': network.chain_id,
                'gas_price_wei': gas_price,
                'gas_price_gwei': w3.from_wei(gas_price, 'gwei'),
                'estimated_cost_usd': float(w3.from_wei(gas_price * 21000, 'ether')) * 2400  # ETH price simulation
            }
        except Exception as e:
            gas_prices[network.name] = {
                'error': str(e)
            }
    
    return Response({
        'success': True,
        'data': gas_prices
    })