# Bug Fix Workflow

## Objective

Resolve reported defects by identifying and correcting the root cause while minimizing the impact on existing functionality.

---

## Step 1 — Understand the Issue
Before making any changes:
- Read the bug report or issue description.
- Identify the expected behavior.
- Identify the actual behavior.
- Gather any available logs, screenshots, error messages, or reproduction steps.
- Ask for clarification if the issue cannot be reproduced or the expected behavior is unclear.

---

## Step 2 — Load Relevant Context
Load:
- Base Context
- Relevant feature context(s)
- Relevant domain rules (UI, API, Database, Security, Business)
Only load contexts related to the affected feature.

---

## Step 3 — Reproduce the Bug
Attempt to reproduce the issue before making changes.
Document:
- Steps to reproduce
- Preconditions
- Test data
- Environment
- Frequency (Always, Sometimes, Rare)
Do not attempt a fix until the issue is understood.

---

## Step 4 — Investigate the Root Cause
Inspect:
- Existing implementation
- Related components
- Services
- APIs
- Database queries
- State management
- Recent changes

Identify the root cause before implementing a fix.
Avoid speculative changes.

---

## Step 5 — Implement the Fix
When implementing:
- Change only the code required to resolve the issue.
- Reuse existing components and services.
- Preserve existing architecture.
- Do not introduce unrelated refactoring.
- Do not change business rules unless explicitly requested.
- Follow all coding standards.

---

## Step 6 — Regression Check
Verify that:
- The reported issue is resolved.
- Related functionality still works.
- Existing user workflows remain unaffected.
- No new warnings or errors have been introduced.

---

## Step 7 — Testing
Perform appropriate validation such as:
- Manual verification
- Unit tests
- Integration tests
- End-to-end tests (if applicable)

Do not claim tests passed unless they were actually executed.

---

## Step 8 — Report
Always include:

### Root Cause
Explain why the bug occurred.

### Fix Implemented
Summarize the code changes made.

### Files Modified
List all modified files.

### Validation Performed
Describe the tests or verification completed.

### Remaining Risks
Document any known limitations, assumptions, or follow-up work.

---

# Bug Fix Principles
Always:
- Fix the root cause, not just the symptom.
- Keep the fix as small and focused as possible.
- Preserve backward compatibility whenever possible.
- Maintain existing architecture and design patterns.
- Reuse existing code rather than duplicating logic.
- Follow security, database, and business rules.

Never:
- Modify unrelated code.
- Refactor unrelated modules during a bug fix.
- Introduce breaking changes without approval.
- Suppress errors without understanding their cause.
- Mark a bug as fixed without validation.