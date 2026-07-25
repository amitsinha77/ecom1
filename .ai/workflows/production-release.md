# Production Release Workflow

## Objective

Deploy safely with minimal risk.

---

## Pre-Release

Verify:

- All tests pass
- Build succeeds
- Lint passes
- Type checking passes

---

## Database

If applicable:

- Run migrations
- Verify backups
- Confirm rollback plan

---

## Configuration

Verify:

- Environment variables
- API keys
- Feature flags
- Secrets

---

## Deployment

Deploy according to the project's deployment strategy.

Monitor:

- Build logs
- Deployment logs
- Application startup

---

## Post-Deployment

Verify:

- Login
- Booking flow
- Payments
- Notifications
- Dashboards
- Critical APIs

---

## Monitoring

Review:

- Error logs
- Performance metrics
- Failed jobs
- Alerts

---

## Rollback

If critical issues are found:

- Roll back deployment
- Restore database only if required
- Notify stakeholders

---

## Release Report

Document:

- Version deployed
- Migration status
- Validation completed
- Issues identified
- Rollback status (if applicable)