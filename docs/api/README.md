/**
 * FinTech Banking API Documentation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * This API documentation covers the comprehensive fintech banking platform
 * with traditional banking and Web3 integration capabilities.
 */

# FinTech Banking API Documentation

## Overview

The FinTech Banking API is a comprehensive RESTful API that provides traditional banking services integrated with Web3 capabilities. This API enables developers to build modern financial applications with features like multi-currency accounts, cryptocurrency wallets, payment processing, and DeFi integrations.

## Base URL

```
Production: https://api.fintechbank.com/v1
Staging: https://staging-api.fintechbank.com/v1
Development: http://localhost:8000/api/v1
```

## Authentication

The API supports multiple authentication methods:

### 1. JWT Token Authentication (Traditional)
```http
Authorization: Bearer <jwt_token>
```

### 2. Web3 Wallet Authentication
```http
Authorization: Wallet <wallet_address>:<signature>
X-Wallet-Message: <signed_message>
```

### 3. API Key Authentication (Server-to-Server)
```http
X-API-Key: <api_key>
X-API-Secret: <api_secret>
```

## Rate Limiting

- **Free Tier**: 1,000 requests per hour
- **Pro Tier**: 10,000 requests per hour
- **Enterprise**: Custom limits

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2024-01-20T14:30:25Z",
    "request_id": "req_1234567890"
  }
}
```

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Temporary service outage |

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_CREDENTIALS` | Invalid email/password or wallet signature |
| `INSUFFICIENT_FUNDS` | Account balance too low for transaction |
| `VALIDATION_ERROR` | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |
| `WALLET_NOT_CONNECTED` | Web3 wallet not properly connected |
| `TRANSACTION_FAILED` | Blockchain transaction failed |
| `KYC_REQUIRED` | KYC verification required for this action |
| `ACCOUNT_SUSPENDED` | User account is suspended |

## Pagination

List endpoints support cursor-based pagination:

### Request Parameters
```http
GET /api/v1/transactions?limit=20&cursor=eyJpZCI6MTIzNDU2Nzg5MH0
```

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "has_more": true,
    "next_cursor": "eyJpZCI6MTIzNDU2Nzg5MH0",
    "prev_cursor": null,
    "total_count": 1500
  }
}
```

## Webhooks

The API supports webhooks for real-time event notifications:

### Supported Events
- `transaction.created`
- `transaction.completed`
- `transaction.failed`
- `account.created`
- `user.kyc_approved`
- `payment.received`

### Webhook Payload Example
```json
{
  "event": "transaction.completed",
  "data": {
    "id": "txn_1234567890",
    "amount": "100.00",
    "currency": "USD",
    "status": "completed"
  },
  "timestamp": "2024-01-20T14:30:25Z",
  "webhook_id": "wh_abcdef123456"
}
```

## SDK and Libraries

Official SDKs are available for:
- **JavaScript/TypeScript**: `@fintechbank/js-sdk`
- **Python**: `fintechbank-python`
- **PHP**: `fintechbank/php-sdk`
- **Go**: `github.com/fintechbank/go-sdk`

## Testing

### Sandbox Environment
Use the staging environment for testing:
```
Base URL: https://staging-api.fintechbank.com/v1
```

### Test Data
Test accounts and transactions are available in sandbox mode.

## Support

- **Documentation**: https://docs.fintechbank.com
- **Support Email**: support@fintechbank.com
- **Status Page**: https://status.fintechbank.com
- **Community**: https://community.fintechbank.com