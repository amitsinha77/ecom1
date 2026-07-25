# Subscriptions

## Flow

Customer

→ Select Recurring Service

→ Select Frequency

→ Calculate Price

→ Confirm Subscription

→ Stripe Subscription

→ Payment

→ Booking Schedule

→ Recurring Bookings

→ Renewal

→ Payment Retry

→ Cancellation

## Features

* Recurring Cleaning
* Subscription Plans
* Weekly Frequency
* Fortnightly Frequency
* Monthly Frequency
* Stripe Subscriptions
* Automatic Payments
* Subscription Invoices
* Payment Retries
* Subscription Cancellation
* Subscription Changes

## Rules

* Stripe must be the source of truth for subscription payment status.
* Subscription creation must be server-side.
* Verify all Stripe webhooks.
* Webhook processing must be idempotent.
* Prevent duplicate subscriptions.
* Recurring bookings must respect cleaner availability.
* Subscription pricing must be calculated server-side.
* Changes to subscription pricing must be handled explicitly.
* Cancellation rules must be enforced server-side.
* Failed payments must trigger appropriate retry and notification workflows.
* Subscription status must remain synchronized with Stripe.
* Customers can access only their own subscriptions.
* Admin subscription actions must be authorized and audited.

## Use this context

* Only when developing or modifying recurring cleaning, subscription plans, recurring bookings, Stripe subscriptions, automatic payments, subscription invoices, renewals, cancellations, or subscription changes.
