# Coding Rules

## General Principles

Write production-ready TypeScript.

Prioritize:

* Readability
* Maintainability
* Security
* Reusability
* Testability
* Performance

Do not generate throwaway code that is expected to be replaced later.

## Before Coding

Before modifying code:

1. Read `.ai/context.md`.
2. Identify the relevant module.
3. Read the relevant feature context.
4. Inspect existing implementation.
5. Reuse existing components and services where possible.
6. Check database and API impact.
7. Check security implications.

Do not modify unrelated files.

## TypeScript

* Use TypeScript throughout the application.
* Avoid `any`.
* Prefer explicit types for public interfaces.
* Use shared types where appropriate.
* Keep API request and response types consistent.
* Validate external data at runtime.

## Components

* Build reusable components.
* Avoid large monolithic components.
* Keep components focused on one responsibility.
* Separate presentation from business logic.
* Use shadcn/ui components where appropriate.
* Do not duplicate UI patterns unnecessarily.

## Business Logic

Business logic must not be embedded directly into UI components.

Prefer:


UI
↓
Action / API
↓
Service
↓
Database / External Provider


Examples:


Booking Service
Pricing Service
Payment Service
Notification Service


## Data Access

* Keep database access organized.
* Do not scatter raw database queries throughout UI components.
* Validate data before database operations.
* Handle database errors explicitly.
* Respect RLS and authorization.

## API

* Validate every external input.
* Authenticate protected requests.
* Authorize every protected operation.
* Return consistent responses.
* Do not expose internal implementation details.

## Error Handling

* Handle expected errors explicitly.
* Provide useful user-facing messages.
* Log technical details securely.
* Never expose secrets or stack traces to users.

## Environment Variables

* Never hardcode secrets.
* Never commit `.env` files containing secrets.
* Use environment variables.
* Validate required environment variables at startup where appropriate.

## Naming

Use descriptive names.

Prefer:


calculateBookingPrice()
createBooking()
processPayment()
sendBookingConfirmation()


Avoid:


doThing()
process()
handle()


## Comments

Write comments only when they explain non-obvious reasoning.

Do not write comments that merely repeat the code.

## Code Changes

When modifying existing code:

* Preserve working functionality.
* Avoid unnecessary rewrites.
* Maintain backward compatibility where practical.
* Update related tests.
* Check for side effects.

## AI Development Rule

Do not invent architecture, APIs, database tables, or business rules when existing project context already defines them.

If requirements conflict, stop and report the conflict before implementing.
