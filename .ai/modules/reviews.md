# Reviews

## Flow

Completed Booking

→ Review Request

→ Customer Submits Review

→ Validate Booking

→ Validate Customer

→ Store Review

→ Moderation

→ Publish

→ Rating Aggregation

## Features

* Customer Reviews
* Cleaner Ratings
* Service Ratings
* Review Moderation
* Rating Aggregation
* Review Requests

## Rules

* Only eligible customers can submit reviews.
* A review must be associated with a valid completed booking.
* Customers cannot review bookings they do not own.
* Prevent duplicate reviews where required.
* Validate review content server-side.
* Protect against spam and abuse.
* Apply rate limiting.
* Admin moderation must be authorized.
* Published reviews must not expose unnecessary personal information.
* Ratings must be calculated server-side.
* Review deletion and moderation actions must be auditable.
* Do not allow users to manipulate aggregate ratings directly.

## Use this context

* Only when developing or modifying customer reviews, cleaner ratings, service ratings, moderation, review requests, or rating calculations.
