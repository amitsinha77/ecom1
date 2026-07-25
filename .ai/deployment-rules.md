# Deployment Rules

## Environments

Use separate environments where practical:

```text
Development
↓
Staging / Preview
↓
Production
```

Do not test experimental code directly in production.

## Vercel

Production Next.js deployments use Vercel.

Preview deployments should be used to validate changes before production release.

## Environment Variables

Never commit secrets to Git.

Use environment variables for:

* Supabase credentials
* Stripe keys
* Resend API keys
* Twilio credentials
* Google Maps credentials
* Turnstile keys
* Other third-party secrets

Use separate credentials for development, staging, and production where practical.

## Database

Production database changes must use controlled migrations.

Before applying migrations:

1. Review schema changes.
2. Check existing data.
3. Check indexes.
4. Check RLS policies.
5. Check application compatibility.
6. Test migration in a non-production environment.

## Deployment Process

```text
Code Change
↓
Local Validation
↓
Automated Tests
↓
Security Checks
↓
Build
↓
Preview Deployment
↓
Functional Validation
↓
Production Deployment
↓
Health Check
↓
Monitoring
```

## Build

Every production deployment must successfully complete the production build.

Check:

* TypeScript
* Build errors
* Environment variables
* Database connectivity
* API configuration

## Security

Before production deployment verify:

* No secrets committed
* No debug credentials
* No test accounts exposed
* Secure environment variables
* HTTPS enabled
* Security headers configured
* Authentication enabled
* Authorization verified
* RLS enabled
* Rate limiting active

## Database Backups

Production data must have appropriate backup and recovery procedures.

Backups must be monitored and periodically tested for restoration.

## Monitoring

Monitor:

* Application errors
* API failures
* Database failures
* Payment failures
* Webhook failures
* Authentication failures
* Performance
* Availability

## Rollback

Every production release should have a rollback strategy.

If a deployment introduces a critical issue:

1. Stop further deployment.
2. Assess impact.
3. Roll back application code where appropriate.
4. Restore database state only when necessary and safe.
5. Investigate root cause.
6. Apply fix.
7. Re-test.
8. Re-deploy.

## Production Changes

Do not make untracked production changes.

All production changes must be represented in version control or documented operational procedures.

## Release Checklist

Before production release:

* Tests pass
* Build passes
* Security checks pass
* Database migrations reviewed
* Environment variables verified
* Payment integration verified
* Webhooks verified
* Critical user flows tested
* Monitoring available
* Rollback plan available

## AI Development Rule

Do not deploy or modify production infrastructure without explicit instruction.

Never delete production data.

Never run destructive database operations without confirmation and a safe migration strategy.
