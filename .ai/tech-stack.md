# Technology Stack

## Application

Project Name:
PureMaids

Application Type:
Multi-portal SaaS platform for domestic and commercial cleaning services.

## Frontend

* Next.js 15
* TypeScript
* React
* Tailwind CSS
* shadcn/ui

Use the Next.js App Router architecture.

Prefer Server Components by default.

Use Client Components only when interactivity or browser APIs require them.

## Backend

* Supabase
* PostgreSQL
* Next.js server-side functionality
* Server-side API routes / route handlers
* Service-layer architecture for business logic

Business logic must not be duplicated across frontend components.

## Authentication

* Supabase Auth

Use Supabase Auth for:

* Registration
* Login
* Logout
* Email verification
* Password reset
* Session management
* MFA where required

Authorization must be implemented using application-level permissions and PostgreSQL Row Level Security.

## Database

* PostgreSQL
* Supabase

Use:

* Foreign keys
* Constraints
* Indexes
* Database functions
* Triggers where appropriate
* Views where appropriate
* Row Level Security

Database access must follow least-privilege principles.

## Storage

* Supabase Storage

Use private buckets for sensitive files.

Use signed URLs when temporary access is required.

## Payments

* Stripe

Use Stripe for:

* Payments
* Deposits
* Subscriptions
* Invoices
* Refunds
* Payment methods
* Webhooks
* Payment retries

Never expose Stripe secret keys to the browser.

## Email

* Resend

Use Resend for transactional emails.

Examples:

* Welcome emails
* Email verification
* Password reset
* Booking confirmation
* Booking reminders
* Payment notifications
* Invoice notifications
* Review requests

## SMS

* Twilio

Use Twilio for transactional SMS notifications where required.

## Maps

* Google Maps API

Use for:

* Address lookup
* Postcode validation
* Location services
* Travel distance
* Travel charge calculations
* Cleaner navigation where applicable

API keys must be restricted appropriately.

## Calendar

* FullCalendar

Use for:

* Booking calendar
* Cleaner availability
* Admin scheduling
* Operational planning

## Charts

* Recharts

Use for:

* Revenue
* Booking analytics
* Performance metrics
* Admin reporting

## Deployment

* Vercel

Use Vercel for production Next.js deployment.

## Development Standards

* TypeScript strict mode
* ESLint
* Prettier where configured
* Environment variables for secrets
* Git-based version control
* Automated testing
* Production builds before release

## Rules

* Do not introduce a new major library when an existing project dependency already solves the requirement.
* Do not replace the approved technology stack without explicit approval.
* Keep integrations isolated behind service modules.
* Keep business logic independent from UI components.
* Keep secrets server-side.
* Prefer maintainable, typed, reusable implementations.
