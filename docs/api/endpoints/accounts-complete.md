/**
 * Complete Account Management API Documentation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

# Account Management API - Complete Reference

## Overview

The Account Management API handles bank account creation, updates, balance tracking, and security events. It supports both traditional fiat accounts and cryptocurrency wallets with comprehensive balance management and transaction history.

**Developed by Adam J Smith / NØIR9 FOUNDATION INC**

## Base URL
```
https://api.fintechbank.com/v1/accounts
```

## Security Requirements

| Endpoint | Authentication | Rate Limit | Special Requirements |
|----------|----------------|------------|---------------------|
| `GET /accounts` | Bearer Token | 1000/min per user | User owns accounts |
| `POST /accounts` | Bearer Token | 10/min per user | KYC verification |
| `GET /accounts/{id}` | Bearer Token | 1000/min per user | Account ownership |
| `PATCH /accounts/{id}` | Bearer Token | 100/min per user | Account ownership |
| `POST /accounts/{id}/freeze` | Bearer Token | 10/min per user | Admin or owner |
| `GET /accounts/{id}/balance-history` | Bearer Token | 100/min per user | Account ownership |
| `POST /accounts/{id}/transfer` | Bearer Token | 50/min per user | 2FA for large amounts |

---

## List User Accounts

Retrieve all accounts belonging to the authenticated user with filtering and pagination support.

### Endpoint
```http
GET /accounts
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 1000 requests per minute per user
- **Permissions**: Users can only access their own accounts

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `account_type` | string | No | Filter by account type | `checking` |
| `currency` | string | No | Filter by currency | `USD` |
| `is_active` | boolean | No | Filter by active status | `true` |
| `limit` | integer | No | Results per page (1-100) | `20` |
| `cursor` | string | No | Pagination cursor | `eyJpZCI6MTIzNH0` |

#### Supported Account Types
- `checking` - Standard checking account
- `savings` - High-yield savings account
- `investment` - Investment account
- `crypto` - Cryptocurrency wallet
- `business` - Business account

#### Supported Currencies
- **Fiat**: `USD`, `EUR`, `GBP`
- **Crypto**: `ETH`, `BTC`, `USDC`, `USDT`, `DAI`

### Request Example
```http
GET /accounts?account_type=checking&currency=USD&is_active=true&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User-Agent: FinTechApp/1.0
```

### Response Examples

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "acc_1234567890",
      "account_number": "1011234567890",
      "account_type": "checking",
      "currency": "USD",
      "available_balance": "5250.75",
      "ledger_balance": "5250.75",
      "pending_balance": "0.00",
      "is_active": true,
      "is_frozen": false,
      "interest_rate": "0.0150",
      "monthly_fee": "5.00",
      "overdraft_limit": "500.00",
      "limits": [
        {
          "limit_type": "daily_withdraw",
          "limit_amount": "2500.00",
          "used_amount": "150.00",
          "remaining_limit": "2350.00",
          "reset_date": "2024-01-21"
        }
      ],
      "created_at": "2024-01-10T09:15:00Z",
      "updated_at": "2024-01-20T14:30:25Z",
      "last_transaction_at": "2024-01-20T12:45:30Z"
    },
    {
      "id": "acc_0987654321",
      "account_number": "4011234567890",
      "account_type": "crypto",
      "currency": "ETH",
      "available_balance": "2.45678900",
      "ledger_balance": "2.45678900",
      "pending_balance": "0.00000000",
      "is_active": true,
      "is_frozen": false,
      "contract_address": "0x...",
      "chain_id": 1,
      "network_name": "Ethereum Mainnet",
      "gas_price_gwei": "25",
      "created_at": "2024-01-12T15:20:00Z",
      "updated_at": "2024-01-20T14:30:25Z",
      "last_transaction_at": "2024-01-19T18:22:15Z"
    }
  ],
  "pagination": {
    "has_more": false,
    "next_cursor": null,
    "prev_cursor": null,
    "total_count": 2
  }
}
```

### Code Examples

#### JavaScript/TypeScript
```javascript
const listAccounts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Add filters to query parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(`https://api.fintechbank.com/v1/accounts?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'User-Agent': 'FinTechApp/1.0'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    throw error;
  }
};

// Usage examples
const allAccounts = await listAccounts();
const checkingAccounts = await listAccounts({ account_type: 'checking' });
const usdAccounts = await listAccounts({ currency: 'USD', is_active: true });
```

#### Python
```python
import requests
from urllib.parse import urlencode

def list_accounts(token, filters=None):
    """List user accounts with optional filtering"""
    url = 'https://api.fintechbank.com/v1/accounts'
    headers = {
        'Authorization': f'Bearer {token}',
        'User-Agent': 'FinTechApp/1.0'
    }
    
    if filters:
        # Remove None values and convert to query string
        clean_filters = {k: v for k, v in filters.items() if v is not None}
        url += f'?{urlencode(clean_filters)}'
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        return data['data']
        
    except requests.exceptions.HTTPError as e:
        error_data = e.response.json()
        raise Exception(f"Failed to fetch accounts: {error_data['error']['message']}")

# Usage examples
accounts = list_accounts(token)
checking_accounts = list_accounts(token, {'account_type': 'checking'})
active_usd_accounts = list_accounts(token, {'currency': 'USD', 'is_active': True})
```

#### cURL
```bash
# List all accounts
curl -X GET "https://api.fintechbank.com/v1/accounts" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "User-Agent: FinTechApp/1.0"

# List checking accounts only
curl -X GET "https://api.fintechbank.com/v1/accounts?account_type=checking&currency=USD" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "User-Agent: FinTechApp/1.0"
```

---

## Create New Account

Create a new account for the authenticated user with specified type and currency.

### Endpoint
```http
POST /accounts
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 10 requests per minute per user
- **Business Rules**: Maximum 10 accounts per user, KYC verification required for certain types

### Request Body

```json
{
  "account_type": "savings",
  "currency": "USD",
  "initial_deposit": "1000.00"
}
```

#### Required Fields
- `account_type` (string): Type of account to create
- `currency` (string): Account currency

#### Optional Fields
- `initial_deposit` (string): Initial deposit amount (must be positive)

### Business Rules

1. **Account Limits**: Maximum 10 accounts per user
2. **Uniqueness**: One account per type/currency combination per user
3. **KYC Requirements**:
   - `investment` accounts require verified KYC
   - `business` accounts require business verification
   - `crypto` accounts require wallet connection
4. **Minimum Deposits**:
   - `checking`: No minimum
   - `savings`: $100 minimum
   - `investment`: $1,000 minimum
   - `crypto`: No minimum
   - `business`: $500 minimum

### Response Examples

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "acc_5566778899",
    "account_number": "2015566778899",
    "account_type": "savings",
    "currency": "USD",
    "available_balance": "1000.00",
    "ledger_balance": "1000.00",
    "pending_balance": "0.00",
    "is_active": true,
    "is_frozen": false,
    "interest_rate": "0.0250",
    "monthly_fee": "0.00",
    "overdraft_limit": "0.00",
    "limits": [
      {
        "limit_type": "daily_withdraw",
        "limit_amount": "1000.00",
        "used_amount": "0.00",
        "remaining_limit": "1000.00",
        "reset_date": "2024-01-21"
      }
    ],
    "created_at": "2024-01-20T14:30:25Z",
    "updated_at": "2024-01-20T14:30:25Z",
    "last_transaction_at": null
  }
}
```

#### Error Responses

**400 Bad Request - Validation Error**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid account type or currency combination",
    "details": {
      "account_type": ["Crypto accounts cannot use fiat currencies"],
      "initial_deposit": ["Amount must be at least $100 for savings accounts"]
    },
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please choose a valid account type and currency combination"
  }
}
```

**409 Conflict - Account Already Exists**
```json
{
  "error": {
    "code": "ACCOUNT_EXISTS",
    "message": "You already have a savings account in USD",
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please choose a different account type or currency"
  }
}
```

**422 Unprocessable Entity - Business Rule Violation**
```json
{
  "error": {
    "code": "KYC_VERIFICATION_REQUIRED",
    "message": "KYC verification is required for investment accounts",
    "details": {
      "current_kyc_status": "pending",
      "required_kyc_status": "verified"
    },
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please complete KYC verification before creating an investment account"
  }
}
```

### Code Examples

#### JavaScript/TypeScript
```javascript
const createAccount = async (accountData) => {
  try {
    const response = await fetch('https://api.fintechbank.com/v1/accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FinTechApp/1.0'
      },
      body: JSON.stringify(accountData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create account:', error);
    throw error;
  }
};

// Usage examples
const savingsAccount = await createAccount({
  account_type: 'savings',
  currency: 'USD',
  initial_deposit: '1000.00'
});

const cryptoAccount = await createAccount({
  account_type: 'crypto',
  currency: 'ETH'
});
```

#### Python
```python
def create_account(token, account_data):
    """Create a new account"""
    url = 'https://api.fintechbank.com/v1/accounts'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'User-Agent': 'FinTechApp/1.0'
    }
    
    try:
        response = requests.post(url, json=account_data, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        return data['data']
        
    except requests.exceptions.HTTPError as e:
        error_data = e.response.json()
        raise Exception(f"Failed to create account: {error_data['error']['message']}")

# Usage examples
savings_account = create_account(token, {
    'account_type': 'savings',
    'currency': 'USD',
    'initial_deposit': '1000.00'
})

crypto_account = create_account(token, {
    'account_type': 'crypto',
    'currency': 'ETH'
})
```

---

## Get Account Details

Retrieve detailed information about a specific account including limits, transaction history summary, and security events.

### Endpoint
```http
GET /accounts/{account_id}
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 1000 requests per minute per user
- **Permissions**: User must own the account

### Path Parameters
- `account_id` (string): The unique account identifier

### Response Examples

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "acc_1234567890",
    "account_number": "1011234567890",
    "account_type": "checking",
    "currency": "USD",
    "available_balance": "5250.75",
    "ledger_balance": "5250.75",
    "pending_balance": "0.00",
    "is_active": true,
    "is_frozen": false,
    "freeze_reason": null,
    "interest_rate": "0.0150",
    "monthly_fee": "5.00",
    "overdraft_limit": "500.00",
    "limits": [
      {
        "limit_type": "daily_withdraw",
        "limit_amount": "2500.00",
        "used_amount": "150.00",
        "remaining_limit": "2350.00",
        "reset_date": "2024-01-21"
      },
      {
        "limit_type": "monthly_transfer",
        "limit_amount": "10000.00",
        "used_amount": "2500.00",
        "remaining_limit": "7500.00",
        "reset_date": "2024-02-01"
      }
    ],
    "security_events": [
      {
        "event_type": "login_from_new_device",
        "timestamp": "2024-01-20T10:30:00Z",
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0...",
        "status": "approved"
      }
    ],
    "transaction_summary": {
      "total_transactions": 156,
      "last_30_days": {
        "transaction_count": 23,
        "total_inflow": "3250.00",
        "total_outflow": "1890.50",
        "net_change": "1359.50"
      }
    },
    "created_at": "2024-01-10T09:15:00Z",
    "updated_at": "2024-01-20T14:30:25Z",
    "last_transaction_at": "2024-01-20T12:45:30Z"
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "error": {
    "code": "ACCOUNT_NOT_FOUND",
    "message": "Account not found or you don't have permission to access it",
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please check the account ID and ensure you have access to this account"
  }
}
```

### Code Examples

#### JavaScript/TypeScript
```javascript
const getAccountDetails = async (accountId) => {
  try {
    const response = await fetch(`https://api.fintechbank.com/v1/accounts/${accountId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'User-Agent': 'FinTechApp/1.0'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch account details:', error);
    throw error;
  }
};

// Usage
const account = await getAccountDetails('acc_1234567890');
console.log(`Account balance: ${account.available_balance} ${account.currency}`);
```

---

## Update Account Settings

Update account settings such as fees, limits, and preferences.

### Endpoint
```http
PATCH /accounts/{account_id}
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 100 requests per minute per user
- **Permissions**: User must own the account
- **2FA Required**: For certain sensitive changes

### Request Body
```json
{
  "monthly_fee": "0.00",
  "overdraft_limit": "1000.00",
  "interest_rate": "0.0200",
  "notification_preferences": {
    "low_balance_alert": true,
    "large_transaction_alert": true,
    "monthly_statement": true
  }
}
```

### Response Examples

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "acc_1234567890",
    "monthly_fee": "0.00",
    "overdraft_limit": "1000.00",
    "interest_rate": "0.0200",
    "notification_preferences": {
      "low_balance_alert": true,
      "large_transaction_alert": true,
      "monthly_statement": true
    },
    "updated_at": "2024-01-20T14:30:25Z"
  }
}
```

---

## Freeze/Unfreeze Account

Temporarily freeze or unfreeze an account for security purposes.

### Endpoint
```http
POST /accounts/{account_id}/freeze
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 10 requests per minute per user
- **Permissions**: Account owner or admin
- **2FA Required**: Always required for this operation

### Request Body
```json
{
  "action": "freeze",
  "reason": "Suspicious activity detected",
  "duration_hours": 24
}
```

#### Actions
- `freeze` - Freeze the account
- `unfreeze` - Unfreeze the account

### Response Examples

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "acc_1234567890",
    "is_frozen": true,
    "freeze_reason": "Suspicious activity detected",
    "frozen_at": "2024-01-20T14:30:25Z",
    "freeze_expires_at": "2024-01-21T14:30:25Z"
  }
}
```

---

## Get Account Balance History

Retrieve historical balance data for an account with customizable time periods and intervals.

### Endpoint
```http
GET /accounts/{account_id}/balance-history
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 100 requests per minute per user
- **Permissions**: User must own the account

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `start_date` | string | No | Start date (ISO 8601) | `2024-01-01T00:00:00Z` |
| `end_date` | string | No | End date (ISO 8601) | `2024-01-31T23:59:59Z` |
| `interval` | string | No | Data interval | `daily` |

#### Supported Intervals
- `hourly` - Hourly balance snapshots
- `daily` - Daily balance snapshots (default)
- `weekly` - Weekly balance snapshots
- `monthly` - Monthly balance snapshots

### Response Examples

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "account_id": "acc_1234567890",
    "currency": "USD",
    "interval": "daily",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-31T23:59:59Z",
    "history": [
      {
        "date": "2024-01-20",
        "opening_balance": "5100.25",
        "closing_balance": "5250.75",
        "net_change": "150.50",
        "transaction_count": 3,
        "largest_transaction": "100.00",
        "interest_earned": "0.25"
      },
      {
        "date": "2024-01-19",
        "opening_balance": "4950.00",
        "closing_balance": "5100.25",
        "net_change": "150.25",
        "transaction_count": 2,
        "largest_transaction": "200.00",
        "interest_earned": "0.25"
      }
    ],
    "summary": {
      "total_net_change": "300.75",
      "total_transactions": 5,
      "total_interest_earned": "0.50",
      "average_daily_balance": "5075.13"
    }
  }
}
```

### Code Examples

#### JavaScript/TypeScript
```javascript
const getBalanceHistory = async (accountId, options = {}) => {
  const params = new URLSearchParams();
  
  if (options.start_date) params.append('start_date', options.start_date);
  if (options.end_date) params.append('end_date', options.end_date);
  if (options.interval) params.append('interval', options.interval);

  try {
    const response = await fetch(
      `https://api.fintechbank.com/v1/accounts/${accountId}/balance-history?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'User-Agent': 'FinTechApp/1.0'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch balance history:', error);
    throw error;
  }
};

// Usage examples
const lastMonth = await getBalanceHistory('acc_1234567890', {
  start_date: '2024-01-01T00:00:00Z',
  end_date: '2024-01-31T23:59:59Z',
  interval: 'daily'
});

const lastWeek = await getBalanceHistory('acc_1234567890', {
  interval: 'hourly'
});
```

---

## Transfer Between Accounts

Transfer funds between user's own accounts or to external accounts.

### Endpoint
```http
POST /accounts/{account_id}/transfer
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 50 requests per minute per user
- **2FA Required**: For transfers over $1,000 or to external accounts
- **Fraud Detection**: All transfers are screened for suspicious activity

### Request Body
```json
{
  "to_account": "acc_0987654321",
  "amount": "500.00",
  "description": "Transfer to savings",
  "reference": "SAVE001",
  "scheduled_date": "2024-01-21T09:00:00Z"
}
```

#### Required Fields
- `to_account` (string): Destination account ID
- `amount` (string): Transfer amount (positive number)

#### Optional Fields
- `description` (string): Transfer description
- `reference` (string): External reference number
- `scheduled_date` (string): Schedule transfer for future date (ISO 8601)

### Response Examples

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "transaction_id": "txn_1234567890",
    "from_account": "acc_1234567890",
    "to_account": "acc_0987654321",
    "amount": "500.00",
    "currency": "USD",
    "fee_amount": "0.00",
    "status": "completed",
    "description": "Transfer to savings",
    "reference": "SAVE001",
    "created_at": "2024-01-20T14:30:25Z",
    "processed_at": "2024-01-20T14:30:26Z",
    "estimated_completion": "2024-01-20T14:30:26Z"
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Insufficient funds for this transfer",
    "details": {
      "available_balance": "450.00",
      "requested_amount": "500.00",
      "currency": "USD"
    },
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please reduce the transfer amount or add funds to your account"
  }
}
```

---

## Account Types and Features

### Checking Account
- **Purpose**: Daily transactions and bill payments
- **Interest Rate**: 0.01% - 0.05% APY
- **Monthly Fee**: $0 - $15 (waived with minimum balance)
- **Overdraft Protection**: Available up to $500
- **ATM Access**: Unlimited with partner networks
- **Debit Card**: Included
- **Mobile Deposits**: Supported
- **Wire Transfers**: Supported

### Savings Account
- **Purpose**: Long-term savings with higher interest
- **Interest Rate**: 0.50% - 2.50% APY
- **Monthly Fee**: $0 (no fees)
- **Minimum Balance**: $100
- **Transaction Limits**: 6 withdrawals per month
- **ATM Access**: Limited to 4 free withdrawals per month
- **Mobile Deposits**: Supported
- **Automatic Transfers**: Supported

### Investment Account
- **Purpose**: Investment in stocks, bonds, and funds
- **Management Fee**: 0.25% - 1.00% annually
- **Minimum Balance**: $1,000
- **Trading Fees**: $0 - $9.95 per trade
- **Research Tools**: Included
- **Tax Reporting**: 1099 forms provided
- **Margin Trading**: Available with approval
- **Options Trading**: Available with approval

### Crypto Account
- **Purpose**: Cryptocurrency storage and trading
- **Supported Assets**: 50+ cryptocurrencies
- **Trading Fees**: 0.25% - 1.00% per trade
- **Network Fees**: Variable (paid by user)
- **Cold Storage**: 95% of funds in cold storage
- **Insurance**: FDIC insured up to $250,000 (USD equivalent)
- **Staking**: Supported for eligible assets
- **DeFi Integration**: Supported

### Business Account
- **Purpose**: Business banking and payments
- **Monthly Fee**: $15 - $50
- **Transaction Limits**: Higher limits available
- **ACH Transfers**: Unlimited
- **Wire Transfers**: Reduced fees
- **Merchant Services**: Available
- **Payroll Services**: Integrated
- **Business Credit**: Available with approval
- **Multi-user Access**: Supported with role-based permissions

---

## Error Codes Reference

| Error Code | HTTP Status | Description | Remediation |
|------------|-------------|-------------|-------------|
| `ACCOUNT_NOT_FOUND` | 404 | Account doesn't exist or no access | Check account ID and permissions |
| `ACCOUNT_EXISTS` | 409 | Account already exists for type/currency | Choose different type or currency |
| `ACCOUNT_FROZEN` | 423 | Account is frozen | Contact support to unfreeze |
| `INSUFFICIENT_FUNDS` | 400 | Not enough balance for operation | Add funds or reduce amount |
| `LIMIT_EXCEEDED` | 429 | Transaction or account limit exceeded | Wait for limit reset or request increase |
| `KYC_VERIFICATION_REQUIRED` | 422 | KYC verification needed | Complete identity verification |
| `TWO_FACTOR_REQUIRED` | 428 | 2FA required for operation | Complete 2FA verification |
| `INVALID_ACCOUNT_TYPE` | 400 | Unsupported account type | Use supported account type |
| `INVALID_CURRENCY` | 400 | Unsupported currency | Use supported currency |
| `BUSINESS_RULE_VIOLATION` | 422 | Violates business rules | Review business rules and retry |

---

## Rate Limiting Details

### Per-User Limits
- **Account Listing**: 1000 requests/minute
- **Account Creation**: 10 requests/minute
- **Account Updates**: 100 requests/minute
- **Transfers**: 50 requests/minute
- **Balance History**: 100 requests/minute
- **Freeze/Unfreeze**: 10 requests/minute

### Global Limits
- **New Account Creation**: 1000 accounts/hour globally
- **Large Transfers (>$10,000)**: 100 transfers/hour globally
- **Crypto Transactions**: 500 transactions/minute globally

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Type: user
```

---

## Webhooks

Account-related events can trigger webhooks to your application:

### Supported Events
- `account.created` - New account created
- `account.updated` - Account settings changed
- `account.frozen` - Account frozen
- `account.unfrozen` - Account unfrozen
- `account.balance_low` - Balance below threshold
- `account.limit_exceeded` - Transaction limit exceeded
- `account.suspicious_activity` - Suspicious activity detected

### Webhook Payload Example
```json
{
  "event": "account.created",
  "data": {
    "account_id": "acc_1234567890",
    "user_id": "usr_1234567890",
    "account_type": "checking",
    "currency": "USD",
    "created_at": "2024-01-20T14:30:25Z"
  },
  "timestamp": "2024-01-20T14:30:25Z",
  "webhook_id": "wh_abcdef123456"
}
```