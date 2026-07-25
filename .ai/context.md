# AI Project Context & Context Routing

You are working as a senior full-stack engineer.
This file is the master context guide for the project.
Every AI assistant working on this repository **must read this file before making any code changes.**

---

# AI Workflow

Before modifying code:

1. Read `.ai/context.md`.
2. Identify the user's task.
3. Determine which Context Set(s) apply.
4. Determine which Workflow(s) apply.
5. Load only the required context files.
6. Inspect the existing implementation before making changes.
7. Reuse existing components, services, utilities, and patterns whenever possible.
8. Modify only the requested scope.
9. Do not change the project architecture without approval.
10. Follow all applicable security, database, business, API, UI, and coding rules.
11. Execute appropriate validation or testing where possible.
12. Report files changed and validation performed.

---

# Context Hierarchy

Every task should use the following hierarchy:

```
Base Context
      ↓
Domain Rules
      ↓
Feature Module(s)
      ↓
Workflow(s)
      ↓
Current User Task
```

Load only the context required for the current task.

---

# Base Context (Always Load)

The following files define the project foundation and should be loaded for nearly every development task:

- project.md
- tech-stack.md
- architecture.md
- coding-rules.md

---

# Workflow Selection

Every implementation task must follow at least one workflow.

| Task | Workflow |
|------|----------|
| New Feature | workflows/new-feature.md |
| Bug Fix | workflows/bug-fix.md |
| Database Schema Changes | workflows/database-change.md |
| Security Review | workflows/security-review.md |
| Production Deployment | workflows/production-release.md |

A task may require multiple workflows.

Examples:

- New feature with database changes → `new-feature.md` + `database-change.md`
- Bug fix affecting authentication → `bug-fix.md`
- Security audit → `security-review.md`
- Production deployment → `production-release.md`

---

# Recommended Context Sets

## Context A — Foundation

    ### Purpose
    Defines the core project structure and development standards.

    ### Load
    Base Context

    ### Required Workflow
    - workflows/new-feature.md

    ### Use when
    - Creating new features
    - General development
    - Refactoring
    - Architectural work

---

## Context B — Design

    ### Purpose
    Defines UI, UX, branding, accessibility, and responsive design.

    ### Load
    Base Context
    - ui-rules.md

    ### Use when
    - Website pages
    - Components
    - Forms
    - Layouts
    - Dashboards
    - Responsive UI

---

## Context C — Identity

    ### Purpose
    Defines authentication, authorization, users, roles, permissions, MFA, and sessions.

    ### Load
    Base Context
    - security-rules.md
    - database-rules.md
    - modules/authentication.md

    ### Use when
    - Login
    - Registration
    - Password reset
    - Sessions
    - MFA
    - Roles
    - Permissions

---

## Context D — Booking

    ### Purpose
    Defines booking, scheduling, availability, recurring bookings, and cancellations.

    ### Load

    Base Context
    - business-rules.md
    - api-rules.md
    - database-rules.md
    - security-rules.md
    - modules/booking.md

    ### Also load when required
    - modules/pricing.md
    - modules/payments.md
    - modules/notifications.md

    ### Use when
    - Booking engine
    - Scheduling
    - Availability
    - Booking workflows

---

## Context E — Pricing

    ### Purpose
    Defines pricing, quotations, VAT, discounts, extras, and travel charges.

    ### Load
    Base Context
    - business-rules.md
    - security-rules.md
    - database-rules.md
    - modules/pricing.md

    ### Use when
    - Price calculations
    - Quotes
    - Discounts
    - Taxes
    - Extras

---

## Context F — Payments

    ### Purpose
    Defines Stripe payments and financial workflows.

    ### Load
    Base Context
    - api-rules.md
    - database-rules.md
    - security-rules.md
    - modules/payments.md

    ### Also load when required
    - modules/subscriptions.md
    - modules/booking.md

    ### Use when
    - Stripe
    - Payments
    - Refunds
    - Deposits
    - Webhooks
    - Invoices
    - Subscriptions

---

## Context G — Customer Portal

    ### Purpose
    Defines customer-facing portal functionality.

    ### Load
    Base Context
    - ui-rules.md
    - business-rules.md
    - security-rules.md
    - database-rules.md
    - modules/customer-portal.md

    ### Use when
    - Customer dashboard
    - Customer profile
    - Customer bookings
    - Customer portal

---

## Context H — Cleaner Portal

    ### Purpose
    Defines cleaner operations and job execution.

    ### Load
    Base Context
    - ui-rules.md
    - business-rules.md
    - security-rules.md
    - database-rules.md
    - modules/cleaner-portal.md

    ### Use when
    - Cleaner dashboard
    - Assigned jobs
    - Availability
    - Job execution

---

## Context I — Admin CRM

    ### Purpose
    Defines CRM and administrative operations.

    ### Load
    Base Context

    - ui-rules.md
    - business-rules.md
    - security-rules.md
    - database-rules.md
    - api-rules.md
    - modules/admin-crm.md

    ### Use when
    - CRM
    - Admin dashboard
    - Management
    - Reporting

---

## Context J — Communication

    ### Purpose
    Defines email, SMS, push notifications, and messaging workflows.

    ### Load
    Base Context
    - api-rules.md
    - security-rules.md
    - modules/notifications.md

    ### Use when
    - Email
    - SMS
    - Notifications
    - Templates
    - Retry logic

---

## Context K — Data

    ### Purpose
    Defines database architecture and persistence.

    ### Load
    Base Context
    - database-rules.md
    - security-rules.md

    Also load the relevant feature module.

    ### Required Workflow
    - workflows/database-change.md

    ### Use when
    - Tables
    - Migrations
    - Views
    - Indexes
    - Triggers
    - Functions
    - Row Level Security (RLS)

---

## Context L — Security

    ### Purpose
    Defines application security and security validation.

    ### Load
    Base Context
    - security-rules.md
    - database-rules.md
    - api-rules.md
    - deployment-rules.md

    ### Required Workflow
    - workflows/security-review.md

    ### Use when
    - Security audits
    - Security hardening
    - Vulnerability reviews
    - Authorization reviews
    - Authentication reviews

---

## Context M — Quality

    ### Purpose
    Defines software testing and quality assurance.

    ### Load
    - project.md
    - coding-rules.md
    - testing-rules.md

    Also load the relevant feature module.

    ### Use when
    - Unit testing
    - Integration testing
    - End-to-end testing
    - Feature validation
    - Bug verification

---

## Context N — Operations

    ### Purpose
    Defines deployment, CI/CD, monitoring, backups, and production operations.

    ### Load
    Base Context
    - testing-rules.md
    - security-rules.md
    - deployment-rules.md

    ### Required Workflow
    - workflows/production-release.md

    ### Use when
    - Production deployment
    - Releases
    - Infrastructure
    - Monitoring
    - Maintenance

---

# Multiple Context Rule

    Many tasks require more than one context.
    Example:
    Implement recurring bookings with Stripe payments and customer notifications.

    Load:
    - Context D — Booking
    - Context E — Pricing
    - Context F — Payments
    - Context J — Communication

    Load every context that directly affects the requested work.

---

# Context Selection Checklist

    Before starting any task, determine:
    - Which feature is being modified?
    - Does it involve UI?
    - Does it involve APIs?
    - Does it involve the database?
    - Does it involve authentication or authorization?
    - Does it involve payments?
    - Does it involve security?
    - Does it require testing?
    - Is this a new feature or a bug fix?
    - Does it require a defined workflow?

    Load only the contexts required to complete the task safely.

---

# Context Priority

    If guidance conflicts, apply the following priority:
    1. Current user task
    2. Workflow requirements
    3. Security rules
    4. Database rules
    5. Business rules
    6. Architecture
    7. Feature module
    8. API rules
    9. Coding rules
    10. UI rules

    If a conflict cannot be resolved safely:
    - Stop implementation.
    - Explain the conflict.
    - Request clarification.

    Never silently change business logic, security behavior, payment flows, or database design.

---

# Validation Requirements

    Before completing a task:
    - Confirm the relevant contexts were followed.
    - Confirm the required workflows were followed.
    - Validate only the requested scope.
    - Do not modify unrelated files.
    - Do not invent missing business rules.
    - Do not claim tests passed unless they were actually executed.

    Always report:
    - Context(s) used
    - Workflow(s) followed
    - Files modified
    - Validation performed
    - Limitations or assumptions

---

# Final Working Context

    Every implementation should be based on:

    ```
    Base Context
    +
    Relevant Domain Rules
    +
    Relevant Feature Module(s)
    +
    Relevant Workflow(s)
    +
    Current User Task
    ```

    Example:

    ```
    Base Context
    - project.md
    - tech-stack.md
    - architecture.md
    - coding-rules.md

    Domain Rules
    - api-rules.md
    - database-rules.md
    - security-rules.md

    Feature Modules
    - modules/booking.md
    - modules/pricing.md
    - modules/payments.md

    Workflows
    - workflows/new-feature.md
    - workflows/database-change.md

    Task
    "Implement recurring bookings with Stripe payment."
    ```

    This combination represents the complete context required for implementation.

## Never

    Do not:
    - create duplicate components
    - expose secrets
    - bypass validation
    - disable security rules
    - create unnecessary APIs
    - ignore existing architecture
    - introduce new dependencies without justification