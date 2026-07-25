# Booking Engine

Flow:

Service
→ Postcode
→ Property
→ Bedrooms
→ Bathrooms
→ Extras
→ Date
→ Time
→ Cleaner Preference
→ Frequency
→ Price
→ Account
→ Payment
→ Confirmation

Rules:
- Price must be calculated server-side
- Customer cannot modify final price
- Availability must be checked before confirmation
- Booking creation must be idempotent
- Payment status must come from Stripe
- Duplicate bookings must be prevented
- Cancellation rules must be enforced server-side

Use this context:
- Only when developing or modifying the booking engine.