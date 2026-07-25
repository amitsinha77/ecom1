# Pricing Engine

## Flow

Service

→ Property Type

→ Bedrooms

→ Bathrooms

→ Square Footage

→ Pets

→ Children

→ Cleaning Frequency

→ Parking

→ Travel

→ Property Condition

→ Deep Cleaning

→ Extras

→ Discount Rules

→ VAT

→ Final Price

## Rules

* Pricing must be calculated server-side.
* Never trust a price supplied by the client.
* The final price must be recalculated before booking confirmation.
* Pricing rules must be centrally managed.
* Support different service types.
* Support one-time and recurring cleaning.
* Support additional extras.
* Support travel charges.
* Support parking charges where applicable.
* Support property condition adjustments.
* Support deep-cleaning charges.
* Support promotional discounts.
* Support coupon and discount codes.
* Support VAT calculation.
* Pricing calculations must be auditable.
* Changes to pricing rules must not silently alter historical bookings.
* Store the final agreed price with the booking.
* Prevent price manipulation through browser or API requests.

## Use this context

* Only when developing or modifying quote calculations, pricing rules, discounts, VAT, travel charges, extras, or the AI quote engine.
