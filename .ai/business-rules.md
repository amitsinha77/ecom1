# Business Rules

## Core Business
PureMaids is a cleaning services platform supporting:
* Domestic cleaning
* Commercial cleaning
* One-time cleaning
* Recurring cleaning
* Customer management
* Cleaner management
* Booking management
* Payments
* Invoicing
* Reviews
* Notifications

## Booking
A booking must contain sufficient information to determine:
* Service
* Property
* Location
* Cleaning requirements
* Date
* Time
* Frequency
* Price
* Customer

Availability must be checked before confirmation.
A booking must not be confirmed if the required availability is unavailable.
Duplicate bookings must be prevented.
Booking creation must be idempotent.

## Pricing
Pricing may depend on:
* Service type
* Property type
* Bedrooms
* Bathrooms
* Square footage
* Pets
* Children
* Cleaning frequency
* Parking
* Travel
* Property condition
* Deep cleaning
* Extras
* Discounts
* VAT

Final prices must be calculated and validated server-side.
Customers must not be able to manipulate final prices.
Historical bookings must retain their agreed final price.

## Payments
Payment status must be determined from Stripe.
A successful payment must not be assumed merely because the customer reaches a success page.
Stripe webhook events must be verified.
Duplicate payment processing must be prevented.

## Recurring Services
Recurring bookings must follow the customer's selected frequency.
Subscription and recurring payment status must remain synchronized with Stripe.
Failed recurring payments must be handled according to the payment recovery workflow.

## Cancellation
Cancellation rules must be enforced server-side.
Cancellation eligibility may depend on:
* Booking status
* Time before appointment
* Service type
* Subscription status
Refund calculations must follow defined business rules.

## Cleaner Assignment
A cleaner should only be assigned when:
* The cleaner is available.
* The cleaner is authorized for the relevant work.
* The cleaner is not already assigned to a conflicting job.
Cleaner assignment must not expose customer payment information.

## Customer Data
Customers can access only their own:
* Profile
* Bookings
* Invoices
* Addresses
* Subscriptions
* Messages
* Support tickets
* Rewards

## Cleaner Data
Cleaners can access only information required to perform assigned work.

## Admin
Administrative access must follow role-based permissions.
Sensitive operations must be restricted and audited.

## Reviews
Reviews should be associated with eligible completed bookings.
Prevent duplicate or fraudulent reviews.

## Notifications
Important business events may trigger:
* Email
* SMS
* In-app notifications
Notifications must be triggered from trusted server-side events.

## Loyalty and Referrals
Loyalty points and referral rewards must be calculated server-side.
Users must not be able to directly modify their points or rewards.

## Auditability
Important business events should be auditable.
Examples:
* Booking creation
* Booking cancellation
* Price changes
* Payment events
* Refunds
* Admin changes
* Role changes
* Subscription changes

## AI Development Rule
Do not change business rules based on assumptions.
If a business requirement is unclear, identify the ambiguity and ask for clarification before implementing logic that could affect:

* Pricing
* Payments
* Bookings
* Refunds
* Subscriptions
* Permissions
* Customer data