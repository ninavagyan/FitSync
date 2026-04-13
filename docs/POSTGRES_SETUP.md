# PostgreSQL Setup

## Purpose

The admin web app can run in two modes:

- `mock`: seeded in-memory data for quick UI work
- `postgres`: persistent data stored in PostgreSQL

Use PostgreSQL for any realistic testing of trainers, customers, settings, and registered accounts.

## Files involved

- Env template: [admin-web/.env.example](/Users/nina/Documents/Codex/FirstProject/admin-web/.env.example)
- Config loader: [admin-web/lib/config.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/config.ts)
- PG pool: [admin-web/lib/server/db.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/db.ts)
- PG service layer: [admin-web/lib/server/postgres-service.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/postgres-service.ts)
- SQL schema: [backend/schema/clubflow_schema.sql](/Users/nina/Documents/Codex/FirstProject/backend/schema/clubflow_schema.sql)

## Local setup

1. Create database:
   `createdb clubflow`
2. Apply schema:
   `psql clubflow -f /Users/nina/Documents/Codex/FirstProject/backend/schema/clubflow_schema.sql`
3. Create local env file from the example.
4. Set:
   - `APP_DATA_PROVIDER=postgres`
   - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/clubflow`
5. Start the admin app.

## Important tables

- `clubs`: club master record
- `users`: authenticated users and customers
- `trainers`: trainer profiles
- `trainings`: scheduled classes
- `bookings`: customer reservations
- `club_settings`: booking and cancellation rules

## Current PostgreSQL behavior

Implemented now:

- auto-ensures a default club row and settings row
- loads dashboard data from database
- creates and updates trainings
- creates and updates trainers
- creates and reads customers
- reads booking rosters
- stores password hashes in `users.password_hash`

## Current limitations

- no migration runner yet
- no transactional customer booking endpoint yet
- no refresh-token/session table yet
- no row-level permissions yet
- no audit log yet

## Recommended next database improvements

1. Add Flyway, Prisma Migrate, Drizzle, or another migration tool.
2. Add booking transaction procedure or service-level transaction logic.
3. Add soft-delete strategy or audit log for admin changes.
4. Split `users` and `customers` further only if business rules require it.
