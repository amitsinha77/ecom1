# Notifications

## Flow

System Event

→ Notification Trigger

→ Determine Recipient

→ Select Channel

→ Generate Template

→ Send

→ Record Status

→ Retry on Failure

→ Log Result

## Channels

* Email
* SMS
* In-App Notifications

## Providers

* Resend
* Twilio

## Events

* Account Registration
* Email Verification
* Password Reset
* Booking Created
* Booking Confirmed
* Booking Rescheduled
* Booking Cancelled
* Payment Successful
* Payment Failed
* Invoice Created
* Cleaner Assigned
* Job Reminder
* Job Started
* Job Completed
* Review Request
* Support Updates

## Rules

* Notifications must be triggered by trusted server-side events.
* Never send notifications based solely on client input.
* Email templates must be reusable.
* SMS sending must be rate limited.
* Sensitive information must not be unnecessarily included in messages.
* Notification delivery status must be recorded.
* Failed notifications should support retry logic.
* Duplicate notifications must be prevented where appropriate.
* Users must be able to manage notification preferences where applicable.
* Respect consent and applicable privacy requirements.
* Do not expose API keys or provider credentials to the frontend.

## Use this context

* Only when developing or modifying email, SMS, in-app notifications, notification templates, delivery tracking, notification preferences, or notification retry logic.
