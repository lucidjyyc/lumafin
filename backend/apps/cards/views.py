"""
Card API Views for FinTech Banking Platform

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Card, CardTransaction
from .serializers import CardSerializer, CardCreateSerializer, VirtualCardCreateSerializer
from apps.accounts.models import Account

class CardViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing physical and virtual cards.
    """
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter cards for authenticated user's accounts."""
        user_accounts = Account.objects.filter(user=self.request.user)
        return Card.objects.filter(account__in=user_accounts)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CardCreateSerializer
        elif self.action == 'create_virtual':
            return VirtualCardCreateSerializer
        return CardSerializer
    
    @action(detail=False, methods=['post'])
    def create_virtual(self, request):
        """Create a new virtual card with specific parameters."""
        serializer = VirtualCardCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Get user's primary account or specified account
            account_id = request.data.get('account_id')
            if account_id:
                try:
                    account = Account.objects.get(id=account_id, user=request.user)
                except Account.DoesNotExist:
                    return Response({
                        'error': {
                            'code': 'ACCOUNT_NOT_FOUND',
                            'message': 'Account not found or access denied'
                        }
                    }, status=status.HTTP_404_NOT_FOUND)
            else:
                # Use primary checking account
                account = Account.objects.filter(
                    user=request.user, 
                    account_type='checking',
                    is_active=True
                ).first()
                
                if not account:
                    return Response({
                        'error': {
                            'code': 'NO_ELIGIBLE_ACCOUNT',
                            'message': 'No eligible account found for virtual card creation'
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create virtual card
            card = serializer.save(account=account)
            
            return Response({
                'success': True,
                'data': CardSerializer(card).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Invalid card data',
                'details': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Activate or deactivate a card."""
        card = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['active', 'inactive', 'blocked']:
            return Response({
                'error': {
                    'code': 'INVALID_STATUS',
                    'message': 'Status must be active, inactive, or blocked'
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        card.status = new_status
        card.save()
        
        return Response({
            'success': True,
            'data': {
                'id': card.id,
                'status': card.status,
                'updated_at': card.updated_at
            }
        })
    
    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        """Get transactions for a specific card."""
        card = self.get_object()
        
        # Get card transactions
        card_transactions = CardTransaction.objects.filter(card=card).order_by('-created_at')
        
        # Pagination
        limit = int(request.query_params.get('limit', 20))
        offset = int(request.query_params.get('offset', 0))
        
        transactions = card_transactions[offset:offset + limit]
        
        transaction_data = []
        for card_txn in transactions:
            transaction_data.append({
                'id': card_txn.transaction.id,
                'amount': card_txn.transaction.amount,
                'currency': card_txn.transaction.currency,
                'merchant_name': card_txn.merchant_name,
                'merchant_category': card_txn.merchant_category,
                'status': card_txn.transaction.status,
                'created_at': card_txn.created_at,
                'authorization_code': card_txn.authorization_code
            })
        
        return Response({
            'success': True,
            'data': transaction_data,
            'pagination': {
                'total': card_transactions.count(),
                'limit': limit,
                'offset': offset,
                'has_more': card_transactions.count() > offset + limit
            }
        })
    
    @action(detail=True, methods=['patch'])
    def update_limits(self, request, pk=None):
        """Update spending limits for virtual cards."""
        card = self.get_object()
        
        if card.card_type not in ['virtual', 'virtual_single_use', 'virtual_merchant_locked', 'virtual_subscription']:
            return Response({
                'error': {
                    'code': 'INVALID_CARD_TYPE',
                    'message': 'Spending limits can only be set on virtual cards'
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        spending_limit = request.data.get('spending_limit')
        if spending_limit is not None:
            if spending_limit < card.spent_amount:
                return Response({
                    'error': {
                        'code': 'LIMIT_TOO_LOW',
                        'message': 'Spending limit cannot be lower than already spent amount'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            card.spending_limit = spending_limit
            card.save()
        
        return Response({
            'success': True,
            'data': CardSerializer(card).data
        })