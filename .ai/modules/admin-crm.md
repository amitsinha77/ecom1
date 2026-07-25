# Admin CRM

## Flow

Admin Login

→ Dashboard
→ Bookings
→ Customers
→ Cleaners
→ Teams
→ Operations
→ Payroll
→ Finance
→ Reports
→ Calendar
→ Availability
→ Marketing
→ Support
→ Reviews
→ CMS
→ Settings
→ Audit Logs

## Features

* Dashboard
* Bookings
* Customers
* Cleaners
* Teams
* Payroll
* Invoices
* Revenue
* Reports
* Calendar
* Availability
* Areas
* Vehicles
* Equipment
* Marketing
* Discount Codes
* Subscriptions
* Support
* Reviews
* Content Management
* Settings
* Audit Logs

## Rules

* Admin access must require authentication.
* Use role-based access control.
* Apply least-privilege permissions.
* Not every administrator should automatically have full system access.
* Sensitive administrative actions must be authorized server-side.
* Financial data must have restricted access.
* Payroll data must have restricted access.
* Customer personal data must be protected.
* Audit sensitive administrative actions.
* Prevent unauthorized record modification.
* Admin users must not bypass database security controls.
* Use Supabase RLS where applicable.
* Administrative APIs must validate authorization independently.
* Destructive actions should require confirmation.
* Critical actions should be logged.
* Never expose secrets or sensitive configuration in the Admin Portal.

## Use this context

* Only when developing or modifying Admin CRM, operational dashboards, customers, cleaners, teams, payroll, invoices, revenue, reports, marketing, CMS, settings, or audit logs.
