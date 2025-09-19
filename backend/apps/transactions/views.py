"""
Transaction API Views for FinTech Banking Platform

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
from .models import Transaction, TransactionCategory, RecurringTransaction, TransactionDispute
from .serializers import (
    TransactionSerializer, TransactionCreateSerializer, TransactionCategorySerializer,
    RecurringTransactionSerializer, TransactionDisputeSerializer
)
from apps.accounts.models import Account

class TransactionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing transactions with advanced filtering and categorization.
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter transactions for authenticated user's accounts."""
        user_accounts = Account.objects.filter(user=self.request.user)
        return Transaction.objects.filter(
            Q(from_account__in=user_accounts) | Q(to_account__in=user_accounts)
        ).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        return TransactionSerializer
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get transaction categories with spending analysis."""
        user_accounts = Account.objects.filter(user=request.user)
        
        # Get transactions from last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        transactions = Transaction.objects.filter(
            from_account__in=user_accounts,
            created_at__gte=thirty_days_ago,
            status='completed'
        )
        
        # Group by category
        categories = TransactionCategory.objects.filter(is_active=True)
        category_data = []
        
        for category in categories:
            category_transactions = transactions.filter(
                tags__category=category
            )
            
            total_spent = category_transactions.aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0')
            
            category_data.append({
                'id': category.id,
                'name': category.name,
                'icon': category.icon,
                'color': category.color,
                'total_spent': float(total_spent),
                'transaction_count': category_transactions.count(),
                'percentage': 0  # Will calculate after getting total
            })
        
        # Calculate percentages
        total_spending = sum(cat['total_spent'] for cat in category_data)
        if total_spending > 0:
            for cat in category_data:
                cat['percentage'] = (cat['total_spent'] / total_spending) * 100
        
        return Response({
            'success': True,
            'data': category_data
        })
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get transaction analytics and insights."""
        user_accounts = Account.objects.filter(user=request.user)
        
        # Date range filtering
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        transactions = Transaction.objects.filter(
            Q(from_account__in=user_accounts) | Q(to_account__in=user_accounts),
            created_at__gte=start_date
        )
        
        # Calculate metrics
        total_transactions = transactions.count()
        total_volume = transactions.filter(status='completed').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0')
        
        # Success rate
        completed_count = transactions.filter(status='completed').count()
        success_rate = (completed_count / total_transactions * 100) if total_transactions > 0 else 0
        
        # Daily transaction volume
        daily_data = []
        for i in range(days):
            day = start_date + timedelta(days=i)
            day_transactions = transactions.filter(
                created_at__date=day.date(),
                status='completed'
            )
            daily_volume = day_transactions.aggregate(total=Sum('amount'))['total'] or Decimal('0')
            
            daily_data.append({
                'date': day.strftime('%Y-%m-%d'),
                'volume': float(daily_volume),
                'count': day_transactions.count()
            })
        
        return Response({
            'success': True,
            'data': {
                'total_transactions': total_transactions,
                'total_volume': float(total_volume),
                'success_rate': round(success_rate, 2),
                'daily_data': daily_data,
                'average_transaction': float(total_volume / total_transactions) if total_transactions > 0 else 0
            }
        })
    
    @action(detail=True, methods=['post'])
    def dispute(self, request, pk=None):
        """Create a dispute for a transaction."""
        transaction = self.get_object()
        
        # Check if dispute already exists
        if hasattr(transaction, 'dispute'):
            return Response({
                'error': {
                    'code': 'DISPUTE_EXISTS',
                    'message': 'A dispute already exists for this transaction'
                }
            }, status=status.HTTP_409_CONFLICT)
        
        serializer = TransactionDisputeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                transaction=transaction,
                user=request.user
            )
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Invalid dispute data',
                'details': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)

class TransactionCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing transaction categories.
    """
    queryset = TransactionCategory.objects.filter(is_active=True)
    serializer_class = TransactionCategorySerializer
    permission_classes = [IsAuthenticated]

class RecurringTransactionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing recurring transactions.
    """
    serializer_class = RecurringTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return RecurringTransaction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """Manually execute a recurring transaction."""
        recurring_transaction = self.get_object()
        
        # Create the actual transaction
        transaction = Transaction.objects.create(
            from_account=recurring_transaction.from_account,
            to_account=recurring_transaction.to_account,
            transaction_type=recurring_transaction.transaction_type,
            amount=recurring_transaction.amount,
            currency=recurring_transaction.currency,
            description=recurring_transaction.description,
            status='pending'
        )
        
        # Update recurring transaction
        recurring_transaction.last_executed = timezone.now()
        recurring_transaction.execution_count += 1
        recurring_transaction.last_transaction = transaction
        recurring_transaction.next_execution = recurring_transaction.calculate_next_execution()
        recurring_transaction.save()
        
        return Response({
            'success': True,
            'data': {
                'transaction_id': transaction.id,
                'next_execution': recurring_transaction.next_execution
            }
        })