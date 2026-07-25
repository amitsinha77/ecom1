# Database Change Workflow

## Objective

Ensure all database changes are safe, reversible, and consistent.

---

## Before Making Changes

Review:

- database-rules.md
- security-rules.md
- relevant feature module

---

## Design

Determine:

- Tables affected
- Relationships
- Constraints
- Indexes
- Foreign keys
- RLS policies
- Triggers
- Views
- Functions

---

## Migration

Create migrations only.

Never modify production schema manually.

Migration should include:

- CREATE
- ALTER
- DROP (only when approved)

---

## Security

Verify:

- Row Level Security
- Least privilege
- Proper ownership
- Access policies

---

## Performance

Review:

- Indexes
- Query plans
- Foreign keys

Avoid:

- N+1 queries
- Missing indexes
- Full table scans

---

## Validation

Confirm:

- Migration runs successfully
- Rollback strategy exists
- Existing data remains valid

---

## Report

Include:

- Migration files
- Schema changes
- Security changes
- Performance considerations    