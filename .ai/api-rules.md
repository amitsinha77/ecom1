# API Rules

## General

All APIs must be production-ready, secure, validated, and documented.

API architecture:

```text
Client
↓
Authentication
↓
Authorization
↓
Input Validation
↓
Business Logic
↓
Database / External Service
↓
Response
```

## Authentication

Protected APIs must verify authentication server-side.

Never trust:

* User IDs supplied by the client
* Role values supplied by the client
* Permission values supplied by the client
* Payment status supplied by the client
* Booking ownership supplied by the client

Use the authenticated session to determine identity.

## Authorization

Every protected API must verify:

1. Who is making the request?
2. What role do they have?
3. Do they have permission?
4. Do they own or have access to the requested resource?

Prevent:

* IDOR
* Horizontal privilege escalation
* Vertical privilege escalation
* Cross-customer data access

## Input Validation

Validate all external input.

Use schema validation such as Zod where appropriate.

Validate:

* Type
* Required fields
* Length
* Format
* Range
* Allowed values

Never rely exclusively on frontend validation.

## Database

All database operations must respect:

* Authentication
* Authorization
* RLS
* Ownership rules
* Constraints

Never disable RLS simply to make an API work.

## API Responses

Use consistent response structures.

Return appropriate HTTP status codes.

Examples:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

Do not expose:

* Database internals
* Stack traces
* Secrets
* API keys
* Sensitive user information

## Rate Limiting

Apply rate limiting to sensitive endpoints.

Prioritize:

* Login
* Registration
* Password reset
* Booking creation
* Contact forms
* Review submission
* Coupon validation
* Payment operations

## Idempotency

Use idempotency protection for operations that can be retried.

Examples:

* Booking creation
* Payment processing
* Stripe webhook processing
* Subscription creation
* Refunds
* Email notifications where necessary

## Payments

Never trust payment status from the client.

Use verified Stripe webhooks as the payment source of truth.

## Webhooks

Webhook endpoints must:

* Verify signatures
* Validate payloads
* Handle duplicate events
* Be idempotent
* Log processing results
* Fail safely

## Pagination

Use pagination for potentially large datasets.

Never return unlimited database records.

## Logging

Log useful operational information without logging:

* Passwords
* Tokens
* API keys
* Payment card information
* Unnecessary PII

## API Design

Keep APIs:

* Consistent
* Typed
* Validated
* Secure
* Versionable where required
* Easy to test

## AI Development Rule

Before creating a new API:

1. Search for an existing endpoint.
2. Check whether existing services can be reused.
3. Check authentication requirements.
4. Check authorization requirements.
5. Check database impact.
6. Add tests.
7. Document the endpoint.
