# Architecture

## Recommended architecture choice

The recommended product architecture is:

- Android app for customers
- customer web app for browser users
- web admin panel for staff
- shared backend API and server-side business rules
- shared PostgreSQL database

The current repository now contains all three product surfaces inside one workspace:

- Android customer app in [app](/Users/nina/Documents/Codex/FirstProject/app)
- customer and admin web app in [admin-web](/Users/nina/Documents/Codex/FirstProject/admin-web)
- schema and backend model in [backend](/Users/nina/Documents/Codex/FirstProject/backend)

## Full system shape

Recommended production system:

- `domain` -> customer web app
- `admin.domain` -> admin web app
- Android app -> customer mobile client
- shared backend logic -> auth, booking rules, validation, schedule state transitions
- PostgreSQL -> source of truth
- push/email notification service -> reminders and operational alerts

Responsibility split:

- Android app: browse, book, cancel, receive reminders
- customer web: browse, register, log in, book, cancel, review bookings
- admin web: create trainers, manage customers, create and edit trainings, inspect bookings
- backend: auth, booking rules, permissions, schedule state transitions, notifications
- database: source of truth for users, trainings, bookings, trainers, and settings

## Domain separation strategy

Current implementation uses one Next.js workspace with two route surfaces:

- root routes for the customer web app
- `/admin` routes for the admin web app

Production intent:

- reverse proxy or host-based routing sends `admin.domain` traffic into the admin route surface
- root domain traffic stays on the customer route surface

Current host and path behavior is configured in:

- [middleware.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/middleware.ts)
- [config.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/config.ts)

## Android client stack

The Android application is designed using:

- Kotlin
- Jetpack Compose
- Hilt
- Room
- WorkManager
- Ktor client
- Kotlin Coroutines and Flow

This remains the recommended stack for the customer-facing mobile app.

## Web stack

The web application uses:

- Next.js App Router
- TypeScript
- server-rendered pages
- route handlers for mutations and APIs
- PostgreSQL via `pg`
- `zod` for validation
- `bcryptjs` for the current local auth implementation

## Why this split is correct

This product has two very different usage patterns:

- customers need fast booking flows on mobile and web
- staff need data-heavy operational screens better suited to web

That means a separate customer app and admin app is the correct long-term shape.

It avoids forcing admin workflows into Android and avoids forcing customers into a desktop-only experience.

## Layering

### Android

Android follows three main layers:

- `ui`
- `domain`
- `data`

### Web

Web is split by product surface and server responsibility:

- customer routes
- admin routes
- shared server services
- shared config and auth helpers

Examples:

- [customer home](/Users/nina/Documents/Codex/FirstProject/admin-web/app/page.tsx)
- [customer session helper](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/customer-web-session.ts)
- [admin layout](/Users/nina/Documents/Codex/FirstProject/admin-web/app/admin/layout.tsx)
- [service switch](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/services.ts)

## Important architectural rules

- do not put booking logic only in the UI layer
- do not trust client-side capacity checks
- keep time handling timezone-safe
- keep PostgreSQL as the source of truth
- keep admin and customer sessions separated
- keep Android and web customer flows aligned to the same business rules
- use backend responses, not UI guesses, for booking success or failure
- keep fake repositories and mock stores only as development scaffolding
