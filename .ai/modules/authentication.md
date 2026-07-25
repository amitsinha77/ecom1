# Authentication

## Flow

Visitor
→ Register / Login
→ Email Verification
→ Authentication
→ Session
→ Role Detection
→ Portal Access
→ Profile
→ Security
→ Logout

## User Types

* Customer
* Cleaner
* Supervisor
* Office Staff
* Manager
* Administrator
* Owner

## Rules

* Use Supabase Auth for authentication.
* Authentication must be handled securely.
* Passwords must never be stored directly by the application.
* Email verification must be supported.
* Password reset must be supported.
* Sessions must be securely managed.
* Protected routes must require authentication.
* Role and permission checks must be enforced server-side.
* Never trust client-side role information.
* Customers must not access Cleaner or Admin areas.
* Cleaners must not access Customer or Admin areas unless explicitly authorized.
* Admin access must be restricted by role and permission.
* Apply appropriate rate limiting to authentication endpoints.
* Support MFA/2FA for privileged users where required.
* Log security-sensitive authentication events.

## Use This Context

* Only when developing or modifying authentication, login, registration, password reset, sessions, MFA, user roles, or protected routes.
