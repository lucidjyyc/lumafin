"""
Main URL Configuration for FinTech Banking API

@author Adam J Smith <boom.ski@hotmail.com>
@copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
@license Commercial License - Proprietary Software
@created 2024-01-20
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import viewsets
from apps.accounts.views import UserViewSet, AccountViewSet
from apps.transactions.views import TransactionViewSet, TransactionCategoryViewSet, RecurringTransactionViewSet
from apps.cards.views import CardViewSet
from apps.web3_integration.views import Web3ViewSet, DeFiViewSet, get_gas_prices

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'transaction-categories', TransactionCategoryViewSet, basename='transaction-category')
router.register(r'recurring-transactions', RecurringTransactionViewSet, basename='recurring-transaction')
router.register(r'cards', CardViewSet, basename='card')
router.register(r'web3', Web3ViewSet, basename='web3')
router.register(r'defi', DeFiViewSet, basename='defi')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Authentication
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API routes
    path('api/v1/', include(router.urls)),
    
    # Web3 specific endpoints
    path('api/v1/web3/gas-prices/', get_gas_prices, name='gas_prices'),
    
    # Health check
    path('health/', lambda request: JsonResponse({'status': 'healthy'})),
]