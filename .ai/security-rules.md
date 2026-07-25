# Security Rules

Never:
- Expose secrets
- Trust client-side validation
- Trust client-supplied prices
- Log passwords or tokens
- Bypass authorization
- Disable RLS to solve application problems

Always:
- Validate input server-side
- Authorize every protected operation
- Validate Stripe webhooks
- Apply rate limiting
- Use secure cookies
- Protect file uploads
- Apply security headers
- Record security-sensitive audit events
- Follow OWASP security principles

Use this context:
- Authentication
- Authorization
- APIs
- Payments
- File uploads
- Database changes
- Admin features
- Security reviews