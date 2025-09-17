/**
 * Authentication API Endpoints Documentation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

# Authentication Endpoints

## Overview

The Authentication API provides secure user authentication using traditional email/password or Web3 wallet signatures. All authentication endpoints return JWT tokens for subsequent API calls.

## Endpoints

### Register User

Create a new user account with optional wallet connection.

**Endpoint:** `POST /auth/register`

**Authentication:** None required

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
  "wallet_signature": "0x...",
  "terms_accepted": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe",
      "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "is_wallet_verified": true,
      "kyc_status": "pending",
      "created_at": "2024-01-20T14:30:25Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

**Error Responses:**

*400 Bad Request - Validation Error:*
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": {
      "email": ["This email is already registered"],
      "password": ["Password must be at least 8 characters long"]
    }
  }
}
```

*409 Conflict - User Already Exists:*
```json
{
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "message": "A user with this email already exists"
  }
}
```

---

### Login User

Authenticate user with email/password or wallet signature.

**Endpoint:** `POST /auth/login`

**Authentication:** None required

**Traditional Login Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Wallet Login Request:**
```json
{
  "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
  "signature": "0x1234567890abcdef...",
  "message": "Login to FinTech Bank at 1640995200"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "username": "johndoe",
      "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "kyc_status": "verified",
      "last_login": "2024-01-20T14:30:25Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

**Error Responses:**

*401 Unauthorized - Invalid Credentials:*
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

*403 Forbidden - Account Suspended:*
```json
{
  "error": {
    "code": "ACCOUNT_SUSPENDED",
    "message": "Your account has been suspended. Please contact support."
  }
}
```

---

### Refresh Token

Refresh an expired JWT token using the refresh token.

**Endpoint:** `POST /auth/refresh`

**Authentication:** Bearer token (expired token accepted)

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

### Connect Wallet

Connect a Web3 wallet to an existing user account.

**Endpoint:** `POST /auth/connect-wallet`

**Authentication:** Bearer token required

**Request Body:**
```json
{
  "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
  "signature": "0x1234567890abcdef...",
  "message": "Connect wallet to FinTech Bank at 1640995200"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1234567890",
      "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "is_wallet_verified": true,
      "updated_at": "2024-01-20T14:30:25Z"
    }
  }
}
```

---

### Logout

Invalidate the current session and JWT token.

**Endpoint:** `POST /auth/logout`

**Authentication:** Bearer token required

**Request Body:** Empty

**Response (204 No Content):** Empty response body

---

### Get User Profile

Retrieve the current user's profile information.

**Endpoint:** `GET /auth/profile`

**Authentication:** Bearer token required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "is_wallet_verified": true,
      "kyc_status": "verified",
      "kyc_verified_at": "2024-01-15T10:20:30Z",
      "is_premium": false,
      "two_factor_enabled": true,
      "total_accounts": 3,
      "total_balance_usd": "15750.25",
      "created_at": "2024-01-10T09:15:00Z",
      "last_login": "2024-01-20T14:30:25Z"
    }
  }
}
```

## Code Examples

### JavaScript/TypeScript
```typescript
// Register user
const registerUser = async (userData: RegisterData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
};

// Login with wallet
const loginWithWallet = async (walletData: WalletLoginData) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(walletData),
  });
  
  return response.json();
};
```

### Python
```python
import requests

# Register user
def register_user(user_data):
    response = requests.post(
        'https://api.fintechbank.com/v1/auth/register',
        json=user_data
    )
    response.raise_for_status()
    return response.json()

# Login user
def login_user(credentials):
    response = requests.post(
        'https://api.fintechbank.com/v1/auth/login',
        json=credentials
    )
    return response.json()
```

### cURL
```bash
# Register user
curl -X POST https://api.fintechbank.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "password_confirm": "SecurePassword123!"
  }'

# Login user
curl -X POST https://api.fintechbank.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

## Security Considerations

1. **Password Requirements**: Minimum 8 characters with uppercase, lowercase, numbers, and special characters
2. **Rate Limiting**: Login attempts are rate-limited to prevent brute force attacks
3. **Wallet Signature Verification**: All wallet signatures are cryptographically verified
4. **Token Expiration**: JWT tokens expire after 1 hour and must be refreshed
5. **HTTPS Only**: All authentication endpoints require HTTPS in production