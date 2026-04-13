# Configuration

## Purpose

The Android app, customer web app, and admin web app are environment-driven. Branding, host routing, storage mode, registration behavior, cookies, database mode, and Android backend URLs can be changed without source edits.

## Web config

Main config file:

- [admin-web/lib/config.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/config.ts)

Env template:

- [admin-web/.env.example](/Users/nina/Documents/Codex/FirstProject/admin-web/.env.example)

### Important web variables

Branding and routing:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_CUSTOMER_APP_NAME`
- `APP_ADMIN_HOSTS`

Persistence and auth:

- `APP_DATA_PROVIDER`
- `DATABASE_URL`
- `PGSSL`
- `APP_AUTH_SECRET`

Cookies:

- `SESSION_COOKIE_NAME`
- `ROLE_COOKIE_NAME`
- `CUSTOMER_SESSION_COOKIE_NAME`

Club defaults and registration:

- `DEFAULT_CLUB_ID`
- `DEFAULT_CLUB_NAME`
- `DEFAULT_TIMEZONE`
- `APP_ALLOW_PUBLIC_REGISTRATION`
- `APP_DEFAULT_REGISTRATION_ROLE`
- `APP_REGISTRATION_ROLES`
- `APP_SHOW_MOCK_LOGIN_HINTS`

## Web routing behavior

Current behavior:

- root domain serves customer routes
- `/admin` serves admin routes for local development
- configured admin hosts can rewrite directly into the admin route space

Example:

- `APP_ADMIN_HOSTS=admin.localhost,admin.clubflow.test`

## Android config

Main Android configuration file:

- [app/build.gradle.kts](/Users/nina/Documents/Codex/FirstProject/app/build.gradle.kts)

### Android base URL overrides

Supported Gradle properties:

- `clubflow.baseUrl.default`
- `clubflow.baseUrl.dev`
- `clubflow.baseUrl.staging`
- `clubflow.baseUrl.prod`

Supported environment variables:

- `CLUBFLOW_BASE_URL`
- `CLUBFLOW_BASE_URL_DEV`
- `CLUBFLOW_BASE_URL_STAGING`
- `CLUBFLOW_BASE_URL_PROD`

Default behavior:

- `dev` points to `http://10.0.2.2:3000/`
- `staging` points to staging placeholder URL
- `prod` points to production placeholder URL

## Recommended local profiles

### Local customer web plus admin web plus PostgreSQL

- `APP_DATA_PROVIDER=postgres`
- `DATABASE_URL=postgresql://.../clubflow`
- backend/web running on port `3000`
- customer browser uses `http://localhost:3000`
- admin browser uses `http://localhost:3000/admin` unless you configure an admin host alias
- Android emulator uses `http://10.0.2.2:3000/`
- Android phone uses your Mac LAN IP override

### Local mock-only web development

- `APP_DATA_PROVIDER=mock`
- customer and admin web routes still work
- data resets when the process restarts

### Local persistent integrated development

- web: `APP_DATA_PROVIDER=postgres`
- web: `DATABASE_URL=...`
- Android: same base URL rules as above
