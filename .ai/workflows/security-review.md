# Security Review Workflow

## Objective

Identify and mitigate security risks.

---

## Authentication

Verify:

- Authentication required where appropriate
- Sessions handled securely
- MFA requirements
- Password handling

---

## Authorization

Verify:

- Role checks
- Permission checks
- Ownership validation

---

## Database

Review:

- RLS policies
- SQL injection risks
- Sensitive data access

---

## API

Verify:

- Input validation
- Authentication
- Authorization
- Rate limiting (if applicable)
- Error handling

---

## Frontend

Verify:

- Sensitive information not exposed
- Secure storage
- Protected routes

---

## Secrets

Ensure:

- No secrets committed
- Environment variables used correctly

---

## Dependencies

Review:

- Outdated packages
- Known vulnerabilities

---

## Report

Document:

- Risks found
- Severity
- Recommended fixes
- Outstanding issues