# Database Rules

Database:
PostgreSQL / Supabase

Every table must have:
- Primary key
- Foreign keys where required
- Appropriate indexes
- Constraints
- Created timestamp
- Updated timestamp where applicable

Security:
- Enable RLS
- Never trust frontend authorization
- Validate ownership server-side
- Use least privilege
- Protect sensitive data

Every migration must:
1. Be reversible where practical
2. Include indexes
3. Include RLS policies
4. Include constraints
5. Consider existing production data

Use this context:
- Database tables
- Migrations
- Queries
- RLS policies
- Triggers
- Functions
- Views
- Data models