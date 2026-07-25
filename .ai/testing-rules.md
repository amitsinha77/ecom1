# Testing Rules

## Role
Senior QA Engineer

## Objective
    Every feature must be tested before being considered complete.

    Testing must cover:
    * Functional correctness
    * Security
    * Authorization
    * Database behavior
    * API behavior
    * UI behavior
    * Error handling
    * Responsive behavior

## Testing Levels

### Unit Tests
    Test isolated business logic.

    Examples:

    * Price calculation
    * VAT calculation
    * Discount calculation
    * Booking rules
    * Cancellation rules
    * Availability calculations

### Integration Tests

    Test interactions between:

    * API and database
    * Services and database
    * Stripe and payment services
    * Notification services
    * Authentication and authorization

### End-to-End Tests

    Test complete user journeys.

    Examples:

    Customer Registration
    → Login
    → Select Service
    → Get Quote
    → Create Booking
    → Pay
    → Receive Confirmation

    Also test:

    Cleaner Login
    → View Job
    → Clock In
    → Complete Job

    And:

    Admin Login
    → View Booking
    → Assign Cleaner
    → Manage Booking

## Security Testing

    Test:
    * Authentication
    * Authorization
    * RLS
    * IDOR
    * Privilege escalation
    * Input validation
    * XSS
    * CSRF where applicable
    * Rate limiting
    * File uploads
    * Webhooks
    * Payment security

## Negative Testing

    Test invalid conditions.

    Examples:

    * Invalid input
    * Missing fields
    * Expired session
    * Unauthorized user
    * Wrong role
    * Duplicate booking
    * Duplicate payment
    * Failed payment
    * Unavailable cleaner
    * Invalid coupon
    * Expired coupon

## Database Testing

    Verify:

    * Constraints
    * Foreign keys
    * RLS policies
    * Indexes
    * Triggers
    * Functions
    * Data integrity

## UI Testing

    Verify:

    * Desktop
    * Tablet
    * Mobile
    * Loading states
    * Empty states
    * Error states
    * Success states
    * Form validation
    * Accessibility
    * Navigation

## Regression Testing

    After modifying an existing feature:

    1. Test the changed feature.
    2. Test related features.
    3. Test critical user journeys.
    4. Check for unintended side effects.

## Production Readiness

    Before release verify:

    * No TypeScript errors
    * No build errors
    * No critical ESLint issues
    * No failing tests
    * No broken links
    * No exposed secrets
    * No unauthorized API access
    * No critical security findings

## Bug Reporting

    Every defect should include:
    * Title
    * Severity
    * Priority
    * Steps to reproduce
    * Expected result
    * Actual result
    * Root cause
    * Recommended fix
    * Regression test

## AI Development Rule

    A feature is not complete when code is generated.

    A feature is complete when:

    Implementation
    +
    Validation
    +
    Testing
    +
    Security Review
    +
    Regression Testing
    =
    Complete Feature

    Do not claim a test passed unless it was actually executed.
    Do not claim a vulnerability was fixed unless the fix was validated.

## Final Validation

    Before completing a task, report:

    * Files changed
    * Tests executed
    * Tests passed
    * Tests failed
    * Security checks performed
    * Known limitations
