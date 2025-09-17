/**
 * Accounts API Endpoints Documentation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

# Accounts Endpoints

## Overview

The Accounts API manages user bank accounts, including traditional fiat accounts and cryptocurrency wallets. Users can create multiple accounts with different currencies and account types.

## Endpoints

### List User Accounts

Retrieve all accounts belonging to the authenticated user.

**Endpoint:** `GET /accounts`

**Authentication:** Bearer token required

**Query Parameters:**
- `account_type` (optional): Filter by account type (`checking`, `savings`, `investment`, `crypto`, `business`)
- `currency` (optional): Filter by currency (`USD`, `EUR`, `GBP`, `ETH`, `BTC`, etc.)
- `is_active` (optional): Filter by active status (`true`, `false`)
- `limit` (optional): Number of results per page (default: 20, max: 100)
- `cursor` (optional): Pagination cursor

**Response (200 OK):**
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

---

### Create Account

Create a new account for the authenticated user.

**Endpoint:** `POST /accounts`

**Authentication:** Bearer token required

**Request Body:**
```json
{
  "account_type": "savings",
  "currency": "USD",
  "initial_deposit": "1000.00"
}
```

**Response (201 Created):**
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
    "created_at": "2024-01-20T14:30:25Z",
    "updated_at": "2024-01-20T14:30:25Z",
    "last_transaction_at": null
  }
}
```

**Error Responses:**

*400 Bad Request - Validation Error:*
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid account type or currency combination",
    "details": {
      "account_type": ["Crypto accounts cannot use fiat currencies"]
    }
  }
}
```

*409 Conflict - Account Already Exists:*
```json
{
  "error": {
    "code": "ACCOUNT_EXISTS",
    "message": "You already have a savings account in USD"
  }
}
```

---

### Get Account Details

Retrieve detailed information about a specific account.

**Endpoint:** `GET /accounts/{account_id}`

**Authentication:** Bearer token required

**Path Parameters:**
- `account_id`: The unique account identifier

**Response (200 OK):**
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
      }
    ],
    "created_at": "2024-01-10T09:15:00Z",
    "updated_at": "2024-01-20T14:30:25Z",
    "last_transaction_at": "2024-01-20T12:45:30Z"
  }
}
```

**Error Responses:**

*404 Not Found:*
```json
{
  "error": {
    "code": "ACCOUNT_NOT_FOUND",
    "message": "Account not found or you don't have permission to access it"
  }
}
```

---

### Update Account

Update account settings and preferences.

**Endpoint:** `PATCH /accounts/{account_id}`

**Authentication:** Bearer token required

**Request Body:**
```json
{
  "monthly_fee": "0.00",
  "overdraft_limit": "1000.00",
  "interest_rate": "0.0200"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "acc_1234567890",
    "monthly_fee": "0.00",
    "overdraft_limit": "1000.00",
    "interest_rate": "0.0200",
    "updated_at": "2024-01-20T14:30:25Z"
  }
}
```

---

### Freeze/Unfreeze Account

Temporarily freeze or unfreeze an account.

**Endpoint:** `POST /accounts/{account_id}/freeze`

**Authentication:** Bearer token required

**Request Body:**
```json
{
  "action": "freeze",
  "reason": "Suspicious activity detected"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "acc_1234567890",
    "is_frozen": true,
    "freeze_reason": "Suspicious activity detected",
    "frozen_at": "2024-01-20T14:30:25Z"
  }
}
```

---

### Get Account Balance History

Retrieve historical balance data for an account.

**Endpoint:** `GET /accounts/{account_id}/balance-history`

**Authentication:** Bearer token required

**Query Parameters:**
- `start_date` (optional): Start date for history (ISO 8601 format)
- `end_date` (optional): End date for history (ISO 8601 format)
- `interval` (optional): Data interval (`daily`, `weekly`, `monthly`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "account_id": "acc_1234567890",
    "currency": "USD",
    "interval": "daily",
    "history": [
      {
        "date": "2024-01-20",
        "opening_balance": "5100.25",
        "closing_balance": "5250.75",
        "net_change": "150.50",
        "transaction_count": 3
      },
      {
        "date": "2024-01-19",
        "opening_balance": "4950.00",
        "closing_balance": "5100.25",
        "net_change": "150.25",
        "transaction_count": 2
      }
    ]
  }
}
```

## Account Types

| Type | Description | Supported Currencies |
|------|-------------|---------------------|
| `checking` | Standard checking account | USD, EUR, GBP |
| `savings` | High-yield savings account | USD, EUR, GBP |
| `investment` | Investment account | USD, EUR, GBP |
| `crypto` | Cryptocurrency wallet | ETH, BTC, USDC, USDT |
| `business` | Business account | USD, EUR, GBP |

## Currency Support

### Fiat Currencies
- `USD` - US Dollar
- `EUR` - Euro
- `GBP` - British Pound

### Cryptocurrencies
- `ETH` - Ethereum
- `BTC` - Bitcoin
- `USDC` - USD Coin
- `USDT` - Tether
- `DAI` - Dai Stablecoin

## Code Examples

### JavaScript/TypeScript
```typescript
// Create a new savings account
const createAccount = async (accountData: CreateAccountData) => {
  const response = await fetch('/api/accounts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(accountData),
  });
  
  return response.json();
};

// Get account balance
const getAccountBalance = async (accountId: string) => {
  const response = await fetch(`/api/accounts/${accountId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  return data.data.available_balance;
};
```

### Python
```python
import requests

def create_account(token, account_data):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(
        'https://api.fintechbank.com/v1/accounts',
        json=account_data,
        headers=headers
    )
    
    return response.json()

def get_account_details(token, account_id):
    headers = {'Authorization': f'Bearer {token}'}
    
    response = requests.get(
        f'https://api.fintechbank.com/v1/accounts/{account_id}',
        headers=headers
    )
    
    return response.json()
```