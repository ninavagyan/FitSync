# Authentication And Access

## Current auth model

The admin web app now has working local authentication pages and cookie-based session handling.

Main files:

- Login page: [admin-web/app/login/page.tsx](/Users/nina/Documents/Codex/FirstProject/admin-web/app/login/page.tsx)
- Register page: [admin-web/app/register/page.tsx](/Users/nina/Documents/Codex/FirstProject/admin-web/app/register/page.tsx)
- Login route: [admin-web/app/api/auth/login/route.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/auth/login/route.ts)
- Register route: [admin-web/app/api/auth/register/route.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/auth/register/route.ts)
- Logout route: [admin-web/app/api/auth/logout/route.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/auth/logout/route.ts)
- Auth service: [admin-web/lib/server/auth-service.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/auth-service.ts)
- Session helpers: [admin-web/lib/server/session.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/session.ts)
- Middleware: [admin-web/middleware.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/middleware.ts)

## Supported roles

- `customer`
- `trainer`
- `manager`
- `owner`

Current admin panel access is granted to:

- `trainer`
- `manager`
- `owner`

Customers can register in the system, but they should not be treated as admin users.

## How login works now

1. User submits email and password on `/login`
2. Route validates the form
3. Auth service loads user by email
4. Password is checked with `bcryptjs`
5. Session cookie and role cookie are written
6. Middleware allows protected routes based on role

## How registration works now

1. User submits the register form on `/register`
2. Route validates fields and password confirmation
3. Route checks whether public registration is allowed
4. Route checks whether the chosen role is allowed for self-registration
5. Password is hashed before persistence
6. Account is created in mock store or PostgreSQL
7. User is signed in immediately after registration

## Environment-controlled auth settings

Important configuration values:

- `APP_ALLOW_PUBLIC_REGISTRATION`
- `APP_DEFAULT_REGISTRATION_ROLE`
- `APP_REGISTRATION_ROLES`
- `SESSION_COOKIE_NAME`
- `ROLE_COOKIE_NAME`
- `APP_SHOW_MOCK_LOGIN_HINTS`

These are documented in [docs/CONFIGURATION.md](/Users/nina/Documents/Codex/FirstProject/docs/CONFIGURATION.md).

## Current security level

This is acceptable for local development and internal prototyping, but not yet production-ready.

Missing pieces:

- secure cookie settings based on environment
- password reset flow
- email verification
- brute-force protection or rate limiting
- CSRF strategy review
- session storage beyond simple cookies
- audit logging for auth events

## Recommended next auth step

Choose one path:

- keep custom auth and harden it properly, or
- move to Supabase Auth, Auth0, Clerk, or another managed provider

For a fast MVP, managed auth is usually the better choice.
