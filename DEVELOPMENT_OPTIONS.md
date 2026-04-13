# Development Options

This file summarizes the main implementation choices and configuration paths for ClubFlow.

## Recommended baseline

- Customer client: native Android with Kotlin and Compose
- Admin client: Next.js with TypeScript
- Database: PostgreSQL
- Current auth mode: local email/password for development
- Recommended production auth direction: managed auth or hardened backend auth
- Push notifications: Firebase Cloud Messaging later
- Distribution: APK during development, Play internal testing later

## Admin web runtime modes

### Mock mode

Use when:

- building UI quickly
- demoing flows without database setup
- working on layout or navigation only

Settings:

- `APP_DATA_PROVIDER=mock`
- `APP_SHOW_MOCK_LOGIN_HINTS=true`

### PostgreSQL mode

Use when:

- testing persistent forms
- validating trainer/customer/training records
- testing login and registration against stored accounts

Settings:

- `APP_DATA_PROVIDER=postgres`
- `DATABASE_URL=...`
- `PGSSL=disable` locally or `require` in hosted environments

## Auth options

### Current implemented mode

- local email/password
- password hash stored in PostgreSQL `users.password_hash`
- cookie-based session gating for admin routes

### Better production options

- Supabase Auth
- Auth0
- Clerk
- custom backend auth with proper session storage

## Registration options

Registration is now configurable by environment.

Useful controls:

- allow or disable public registration
- choose default role in the register form
- choose which roles may self-register

Recommended staging/production pattern:

- disable public registration for manager and owner roles
- create staff accounts administratively
- allow only customer self-registration if public onboarding is needed

## Android client options

Current Android state:

- fake repository
- build flavors `dev`, `staging`, `prod`
- no real API wiring yet

Recommended next Android configuration:

- API base URL per flavor
- auth endpoint base URL
- mock backend flag
- analytics flag
- logging flag

## Backend options

### Current practical path

- keep PostgreSQL schema local
- use admin Next.js server routes as temporary backend surface
- add customer APIs next

### Better long-term path

- move business logic into a dedicated backend service
- keep PostgreSQL as shared database
- add migrations, tests, background jobs, and stronger auth/session handling
