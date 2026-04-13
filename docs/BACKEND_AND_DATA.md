# Backend And Data

## Current backend direction

The project now assumes PostgreSQL as the main persistent data store for the admin system.

At the moment, the backend shape is implemented in two layers:

- SQL schema in [backend/schema/clubflow_schema.sql](/Users/nina/Documents/Codex/FirstProject/backend/schema/clubflow_schema.sql)
- Next.js server-side service layer in [admin-web/lib/server/postgres-service.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/postgres-service.ts)

This is still not a full standalone backend service yet, but it is already using a real relational model instead of only mock data.

## Core entities

### Clubs

Stores club identity and timezone.

### Users

Stores:

- customers
- trainers who have login access
- managers
- owners

Important fields now include:

- `role`
- `is_active`
- `password_hash`

### Trainers

Separate trainer profiles allow business data and assignments to exist even if auth rules later change.

### Trainings

Stores class schedule, trainer assignment, capacity, timing, and status.

### Bookings

Stores customer reservations and attendance-related states.

### Club settings

Stores configurable operational rules like booking and cancellation cutoffs.

## Current design decisions

- PostgreSQL is the persistence layer
- password hashes live in `users.password_hash` for now
- a default club record is auto-created if missing
- admin settings are stored per club
- current admin pages read and write through the shared service layer

## Why PostgreSQL is the right fit here

This product depends on state that should remain consistent:

- capacity limits
- one booking per customer per training
- cancellation rules
- time-based expiry
- admin reporting and filtering

A relational database is the safer default for this type of scheduling system.

## Constraints already modeled

- unique `(training_id, user_id)` booking
- capacity cannot be below booked count
- training end must be after start
- enumerated training and booking statuses
- enumerated user roles

## What is still missing on the backend side

- transactional book and cancel endpoints for customer app
- background processing for expiry and notifications
- migrations
- audit trail
- multi-club scoping beyond a default single-club assumption
- production-grade auth/session subsystem

## Recommended next backend step

Build a dedicated API layer for customer mobile flows:

- `GET /trainings/upcoming`
- `POST /trainings/{id}/book`
- `POST /trainings/{id}/cancel`
- `GET /me/bookings`

That is the point where the Android app can stop depending on the fake repository.
