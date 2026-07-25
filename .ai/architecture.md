# Architecture Rules

Frontend:               Next.js App Router
UI:                     Tailwind CSS + shadcn/ui
Backend:                Next.js server-side services and Supabase
Database:               PostgreSQL
Authentication:         Supabase Auth
Payments:               Stripe
External Services:      Resend, Twilio, Google Maps
Deployment:             Vercel

Rules:
- UI must not directly contain business logic
- Business logic belongs in services
- Database access must be isolated
- Payment logic must be server-side
- Webhooks must be verified
- Sensitive operations require authorization
- Use async/await. 
- Add comments only for complex logic.
- Avoid any. 
- Write unit tests for business logic. 

Use this context: 
When creating or modifying architecture, services, APIs, integrations, or major features.