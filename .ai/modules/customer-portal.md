# Customer Portal

## Flow

Customer Login

→ Dashboard

→ View Bookings

→ Create Booking

→ Manage Booking

→ Reschedule / Cancel

→ View Invoices

→ Manage Addresses

→ Manage Payment Methods

→ Subscriptions

→ Cleaning Checklist

→ Messages

→ Notifications

→ Loyalty Points

→ Referral Rewards

→ Support Tickets

→ Profile

→ Security

## Features

* Dashboard
* Bookings
* Invoices
* Addresses
* Saved Cards
* Subscriptions
* Cleaning Checklist
* Messages
* Notifications
* Loyalty Points
* Referral Rewards
* Support Tickets
* Profile
* Security
* Two-Factor Authentication

## Rules

* Customers can access only their own data.
* Customer authorization must be enforced server-side.
* Use Supabase RLS for database-level protection.
* Customers cannot access other customers' bookings.
* Customers cannot access cleaner or admin data.
* Booking changes must respect cancellation and rescheduling rules.
* Payment information must be handled securely through Stripe.
* Sensitive information must not be exposed in client-side responses.
* Customer actions must be validated server-side.
* Support tickets must be associated with the authenticated customer.
* Loyalty and referral rewards must be calculated server-side.
* All customer-facing pages must be mobile responsive and accessible.

## Use this context

* Only when developing or modifying customer dashboard, customer bookings, invoices, subscriptions, addresses, payments, messages, loyalty, referrals, support, or customer profile features.
