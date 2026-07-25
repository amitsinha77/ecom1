# New Feature Workflow

## Objective

Ensure new features are implemented consistently, safely, and without introducing regressions.

---

## Step 1 — Understand the Request

- Read the user story or feature request.
- Identify affected modules.
- Determine which context set(s) must be loaded.
- Ask for clarification if requirements are ambiguous.

---

## Step 2 — Inspect Existing Code

Before writing code:

- Locate existing implementations.
- Reuse existing components, hooks, services, utilities, and patterns.
- Avoid duplicate functionality.

---

## Step 3 — Design

Before implementation:

- Confirm the architecture supports the feature.
- Identify API changes.
- Identify database changes.
- Identify security implications.
- Identify UI changes.

Do not change the overall architecture without approval.

---

## Step 4 — Implement

- Follow coding standards.
- Keep changes focused.
- Maintain backward compatibility where possible.
- Handle loading, empty, and error states.
- Write clear comments only where necessary.

---

## Step 5 — Validation

Verify:

- Feature works as expected.
- Existing functionality is unaffected.
- No lint errors.
- No TypeScript errors.
- No obvious performance regressions.

---

## Step 6 — Report

Always report:

- Files modified
- Components added
- APIs added or modified
- Database changes
- Validation performed
- Remaining limitations