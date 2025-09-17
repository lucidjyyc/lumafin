/**
 * Complete Authentication API Documentation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

# Authentication API - Complete Reference

## Overview

The Authentication API provides secure user authentication using traditional email/password or Web3 wallet signatures. All authentication endpoints return JWT tokens for subsequent API calls.

**Developed by Adam J Smith / NØIR9 FOUNDATION INC**

## Base URL
```
https://api.fintechbank.com/v1/auth
```

## Security Requirements

| Endpoint | Authentication | Rate Limit | Special Requirements |
|----------|----------------|------------|---------------------|
| `POST /register` | None | 10/min per IP | Email verification |
| `POST /login` | None | 5/min per IP | Account status check |
| `POST /refresh` | Bearer Token | 60/min per user | Valid refresh token |
| `POST /logout` | Bearer Token | 100/min per user | None |
| `GET /profile` | Bearer Token | 1000/min per user | None |
| `POST /connect-wallet` | Bearer Token | 10/min per user | Signature verification |

---

## Register User

Create a new user account with optional wallet connection.

### Endpoint
```http
POST /auth/register
```

### Security Requirements
- **Authentication**: None (public endpoint)
- **Rate Limiting**: 10 requests per minute per IP address
- **Validation**: Email uniqueness, password strength, wallet signature verification

### Request Body

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

#### Required Fields
- `email` (string): Valid email address, must be unique
- `username` (string): 3-30 characters, alphanumeric and underscore only
- `password` (string): Minimum 8 characters, must contain uppercase, lowercase, number, and special character
- `password_confirm` (string): Must match password exactly
- `terms_accepted` (boolean): Must be true

#### Optional Fields
- `first_name` (string): Maximum 50 characters
- `last_name` (string): Maximum 50 characters
- `phone` (string): E.164 format (e.g., +1234567890)
- `wallet_address` (string): Valid Ethereum address (0x followed by 40 hex characters)
- `wallet_signature` (string): Cryptographic signature for wallet verification

### Response Examples

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe",
      "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "is_wallet_verified": true,
      "kyc_status": "pending",
      "is_premium": false,
      "two_factor_enabled": false,
      "created_at": "2024-01-20T14:30:25Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

#### Error Responses

**400 Bad Request - Validation Error**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": {
      "email": ["This email is already registered"],
      "password": ["Password must contain at least one uppercase letter"],
      "wallet_address": ["Invalid Ethereum address format"]
    },
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please correct the validation errors and try again"
  }
}
```

**409 Conflict - User Already Exists**
```json
{
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "message": "A user with this email already exists",
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please use a different email address or try logging in"
  }
}
```

**429 Too Many Requests**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Registration rate limit exceeded",
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please wait 60 seconds before attempting registration again"
  }
}
```

### Code Examples

#### JavaScript/TypeScript
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('https://api.fintechbank.com/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FinTechApp/1.0'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    
    // Store tokens securely
    localStorage.setItem('access_token', data.data.token);
    localStorage.setItem('refresh_token', data.data.refresh_token);
    
    return data.data.user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Usage
const newUser = await registerUser({
  email: 'user@example.com',
  username: 'johndoe',
  password: 'SecurePassword123!',
  password_confirm: 'SecurePassword123!',
  terms_accepted: true
});
```

#### Python
```python
import requests
import json

def register_user(user_data):
    """Register a new user account"""
    url = 'https://api.fintechbank.com/v1/auth/register'
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'FinTechApp/1.0'
    }
    
    try:
        response = requests.post(url, json=user_data, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Store tokens securely (use secure storage in production)
        access_token = data['data']['token']
        refresh_token = data['data']['refresh_token']
        
        return data['data']['user']
        
    except requests.exceptions.HTTPError as e:
        error_data = e.response.json()
        raise Exception(f"Registration failed: {error_data['error']['message']}")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error: {str(e)}")

# Usage
user_data = {
    'email': 'user@example.com',
    'username': 'johndoe',
    'password': 'SecurePassword123!',
    'password_confirm': 'SecurePassword123!',
    'terms_accepted': True
}

new_user = register_user(user_data)
```

#### cURL
```bash
curl -X POST https://api.fintechbank.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "User-Agent: FinTechApp/1.0" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "password_confirm": "SecurePassword123!",
    "first_name": "John",
    "last_name": "Doe",
    "terms_accepted": true
  }'
```

---

## Login User

Authenticate user with email/password or Web3 wallet signature.

### Endpoint
```http
POST /auth/login
```

### Security Requirements
- **Authentication**: None (public endpoint)
- **Rate Limiting**: 5 requests per minute per IP address
- **Brute Force Protection**: Account lockout after 5 failed attempts

### Authentication Methods

#### 1. Traditional Login (Email/Password)
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### 2. Web3 Wallet Login
```json
{
  "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
  "signature": "0x1234567890abcdef...",
  "message": "Login to FinTech Bank at 1640995200"
}
```

### Response Examples

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "johndoe",
      "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "kyc_status": "verified",
      "is_premium": true,
      "two_factor_enabled": true,
      "last_login": "2024-01-20T14:30:25Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

#### Error Responses

**401 Unauthorized - Invalid Credentials**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please check your email and password and try again"
  }
}
```

**403 Forbidden - Account Suspended**
```json
{
  "error": {
    "code": "ACCOUNT_SUSPENDED",
    "message": "Your account has been suspended",
    "details": {
      "reason": "Multiple failed login attempts",
      "suspended_until": "2024-01-21T14:30:25Z"
    },
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please contact support at support@fintechbank.com to resolve this issue"
  }
}
```

### Code Examples

#### JavaScript/TypeScript
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch('https://api.fintechbank.com/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FinTechApp/1.0'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    
    // Store tokens securely
    localStorage.setItem('access_token', data.data.token);
    localStorage.setItem('refresh_token', data.data.refresh_token);
    
    return data.data.user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Traditional login
const user = await loginUser({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});

// Wallet login
const walletUser = await loginUser({
  wallet_address: '0x742d35Cc6634C0532925a3b8D34B60142C7f5e60',
  signature: '0x...',
  message: 'Login to FinTech Bank at 1640995200'
});
```

#### Python
```python
def login_user(credentials):
    """Authenticate user with email/password or wallet"""
    url = 'https://api.fintechbank.com/v1/auth/login'
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'FinTechApp/1.0'
    }
    
    try:
        response = requests.post(url, json=credentials, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Store tokens securely
        access_token = data['data']['token']
        refresh_token = data['data']['refresh_token']
        
        return data['data']['user']
        
    except requests.exceptions.HTTPError as e:
        error_data = e.response.json()
        raise Exception(f"Login failed: {error_data['error']['message']}")

# Traditional login
user = login_user({
    'email': 'user@example.com',
    'password': 'SecurePassword123!'
})

# Wallet login
wallet_user = login_user({
    'wallet_address': '0x742d35Cc6634C0532925a3b8D34B60142C7f5e60',
    'signature': '0x...',
    'message': 'Login to FinTech Bank at 1640995200'
})
```

---

## Refresh Token

Refresh an expired JWT token using the refresh token.

### Endpoint
```http
POST /auth/refresh
```

### Security Requirements
- **Authentication**: Bearer token (expired token accepted)
- **Rate Limiting**: 60 requests per minute per user
- **Token Validation**: Refresh token must be valid and not expired

### Request Body
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response Examples

#### Success Response (200 OK)
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

#### Error Response (401 Unauthorized)
```json
{
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "message": "Refresh token is invalid or expired",
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please log in again to obtain a new token"
  }
}
```

### Code Examples

#### JavaScript/TypeScript
```javascript
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  try {
    const response = await fetch('https://api.fintechbank.com/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'User-Agent': 'FinTechApp/1.0'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      return null;
    }

    const data = await response.json();
    
    // Update stored tokens
    localStorage.setItem('access_token', data.data.token);
    localStorage.setItem('refresh_token', data.data.refresh_token);
    
    return data.data.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    window.location.href = '/login';
    return null;
  }
};

// Auto-refresh token before expiration
setInterval(refreshToken, 50 * 60 * 1000); // Refresh every 50 minutes
```

---

## Connect Wallet

Connect a Web3 wallet to an existing user account.

### Endpoint
```http
POST /auth/connect-wallet
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 10 requests per minute per user
- **Signature Verification**: Cryptographic signature validation required

### Request Body
```json
{
  "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
  "signature": "0x1234567890abcdef...",
  "message": "Connect wallet to FinTech Bank at 1640995200"
}
```

### Response Examples

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "is_wallet_verified": true,
      "updated_at": "2024-01-20T14:30:25Z"
    }
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "error": {
    "code": "SIGNATURE_VERIFICATION_FAILED",
    "message": "Wallet signature verification failed",
    "details": {
      "wallet_address": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "expected_signer": "0x742d35Cc6634C0532925a3b8D34B60142C7f5e60",
      "actual_signer": "0x..."
    },
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890",
    "remediation": "Please ensure you're signing with the correct wallet and try again"
  }
}
```

### Code Examples

#### JavaScript/TypeScript with Web3
```javascript
import Web3 from 'web3';

const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const web3 = new Web3(window.ethereum);
  
  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const accounts = await web3.eth.getAccounts();
    const walletAddress = accounts[0];
    
    // Create message to sign
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `Connect wallet to FinTech Bank at ${timestamp}`;
    
    // Sign message
    const signature = await web3.eth.personal.sign(message, walletAddress, '');
    
    // Send to API
    const response = await fetch('https://api.fintechbank.com/v1/auth/connect-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'User-Agent': 'FinTechApp/1.0'
      },
      body: JSON.stringify({
        wallet_address: walletAddress,
        signature: signature,
        message: message
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data.data.user;
    
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};
```

---

## Get User Profile

Retrieve the current user's profile information.

### Endpoint
```http
GET /auth/profile
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 1000 requests per minute per user
- **Permissions**: User can only access their own profile

### Response Examples

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
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

### Code Examples

#### JavaScript/TypeScript
```javascript
const getUserProfile = async () => {
  try {
    const response = await fetch('https://api.fintechbank.com/v1/auth/profile', {
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
    return data.data.user;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};
```

---

## Logout

Invalidate the current session and JWT token.

### Endpoint
```http
POST /auth/logout
```

### Security Requirements
- **Authentication**: Bearer token required
- **Rate Limiting**: 100 requests per minute per user
- **Token Invalidation**: Blacklists the current JWT token

### Request Body
Empty request body.

### Response Examples

#### Success Response (204 No Content)
Empty response body with 204 status code.

### Code Examples

#### JavaScript/TypeScript
```javascript
const logoutUser = async () => {
  try {
    const response = await fetch('https://api.fintechbank.com/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'User-Agent': 'FinTechApp/1.0'
      }
    });

    // Clear stored tokens regardless of response
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Redirect to login page
    window.location.href = '/login';
    
  } catch (error) {
    console.error('Logout failed:', error);
    // Still clear tokens and redirect
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
};
```

---

## Security Considerations

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character
- Cannot be a common password

### Rate Limiting
- Login attempts: 5 per minute per IP
- Registration: 10 per minute per IP
- Token refresh: 60 per minute per user
- Failed login lockout: 5 attempts = 1 hour lockout

### Wallet Signature Verification
1. Message format: "Login to FinTech Bank at {timestamp}"
2. Signature verification using ecrecover
3. Address comparison with provided wallet address
4. Timestamp validation (within 5 minutes)

### Token Security
- JWT tokens expire after 1 hour
- Refresh tokens expire after 7 days
- Tokens are blacklisted on logout
- Secure HTTP-only cookies recommended for web apps

### HTTPS Requirements
All authentication endpoints require HTTPS in production. HTTP requests will be rejected with a 426 Upgrade Required status.