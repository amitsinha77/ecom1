# Payments

## Flow

Booking

→ Price Confirmation

→ Payment Method

→ Stripe Checkout / Payment

→ Stripe Processing

→ Webhook

→ Payment Verification

→ Booking Confirmation

→ Invoice

→ Email Notification

## Features

* Deposits
* One-time payments
* Recurring payments
* Subscriptions
* Saved payment methods
* Apple Pay
* Google Pay
* Invoices
* Refunds
* Payment retries
* Stripe webhooks

## Rules

* Stripe must be the source of truth for payment status.
* Never trust payment status supplied by the client.
* Never store raw card details.
* Verify all Stripe webhook signatures.
* Webhook processing must be idempotent.
* Prevent duplicate payment processing.
* Prevent duplicate bookings caused by payment retries.
* Final prices must be calculated server-side.
* Refunds must require appropriate authorization.
* Payment events must be logged.
* Failed payments must be handled gracefully.
* Payment status changes must update the appropriate booking and invoice records.
* Payment secrets must never be exposed to the frontend.
* Use secure server-side Stripe integration.

## Use this context

* Only when developing or modifying Stripe integration, payments, deposits, subscriptions, refunds, invoices, payment methods, or payment webhooks.
