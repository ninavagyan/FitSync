# ClubFlow

ClubFlow now has four connected parts:

- Android customer app
- customer web app
- Next.js admin web app
- shared PostgreSQL-backed backend model

## Current status

Implemented now:

- Android app with customer login and registration screens
- Android app wired to authenticated customer APIs for upcoming trainings, booking, and cancellation
- customer web app with login, registration, schedule, and booking pages
- admin web app with dashboard, trainings, trainers, customers, and settings pages
- local authentication flow for admin, customer web, and customer APIs
- PostgreSQL integration path for the admin and customer backend layer
- mock fallback mode for development without a database
- updated SQL schema and environment-based configuration

## Main folders

- Android app: [app](/Users/nina/Documents/Codex/FirstProject/app)
- Web app: [admin-web](/Users/nina/Documents/Codex/FirstProject/admin-web)
- SQL schema: [backend/schema/clubflow_schema.sql](/Users/nina/Documents/Codex/FirstProject/backend/schema/clubflow_schema.sql)
- Docs: [docs](/Users/nina/Documents/Codex/FirstProject/docs)

## Quick start

### Web app and backend surface

1. Copy [admin-web/.env.example](/Users/nina/Documents/Codex/FirstProject/admin-web/.env.example) to `admin-web/.env.local`
2. Choose one mode:
   - `APP_DATA_PROVIDER=mock` for fast UI and API testing
   - `APP_DATA_PROVIDER=postgres` with `DATABASE_URL=...` for persistence
3. Run:

```bash
cd /Users/nina/Documents/Codex/FirstProject/admin-web
npm install
npm run dev
```

Local URLs:

- customer app: `http://localhost:3000`
- admin app: `http://localhost:3000/admin`

Production intent:

- customer app on `domain`
- admin app on `admin.domain`

### Android app

Default local dev target:

- `devDebug` uses `http://10.0.2.2:3000/` unless you override it

Build:

```bash
env JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home ./gradlew assembleDevDebug
```

Optional override examples:

```bash
env JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home \
  ./gradlew assembleDevDebug -Pclubflow.baseUrl.dev=http://192.168.1.50:3000/
```

or

```bash
CLUBFLOW_BASE_URL_DEV=http://192.168.1.50:3000/ \
env JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home ./gradlew assembleDevDebug
```

Use `10.0.2.2` for the Android emulator. Use your Mac's LAN IP for a physical phone.

## Documentation index

- Product overview: [docs/PROJECT_OVERVIEW.md](/Users/nina/Documents/Codex/FirstProject/docs/PROJECT_OVERVIEW.md)
- Architecture: [docs/ARCHITECTURE.md](/Users/nina/Documents/Codex/FirstProject/docs/ARCHITECTURE.md)
- Architecture summary: [docs/ARCHITECTURE_SUMMARY.md](/Users/nina/Documents/Codex/FirstProject/docs/ARCHITECTURE_SUMMARY.md)
- Customer web app: [docs/CUSTOMER_WEB_APP.md](/Users/nina/Documents/Codex/FirstProject/docs/CUSTOMER_WEB_APP.md)
- Android setup: [docs/ANDROID_SETUP.md](/Users/nina/Documents/Codex/FirstProject/docs/ANDROID_SETUP.md)
- Backend and data: [docs/BACKEND_AND_DATA.md](/Users/nina/Documents/Codex/FirstProject/docs/BACKEND_AND_DATA.md)
- Admin web panel: [docs/ADMIN_WEB_PANEL.md](/Users/nina/Documents/Codex/FirstProject/docs/ADMIN_WEB_PANEL.md)
- PostgreSQL setup: [docs/POSTGRES_SETUP.md](/Users/nina/Documents/Codex/FirstProject/docs/POSTGRES_SETUP.md)
- Authentication and access: [docs/AUTH_AND_ACCESS.md](/Users/nina/Documents/Codex/FirstProject/docs/AUTH_AND_ACCESS.md)
- Configuration reference: [docs/CONFIGURATION.md](/Users/nina/Documents/Codex/FirstProject/docs/CONFIGURATION.md)
- Codebase status: [docs/CODEBASE_STATUS.md](/Users/nina/Documents/Codex/FirstProject/docs/CODEBASE_STATUS.md)
- Roadmap: [docs/ROADMAP.md](/Users/nina/Documents/Codex/FirstProject/docs/ROADMAP.md)
- API contract: [docs/api/ADMIN_API_CONTRACT.md](/Users/nina/Documents/Codex/FirstProject/docs/api/ADMIN_API_CONTRACT.md)
- Development options: [DEVELOPMENT_OPTIONS.md](/Users/nina/Documents/Codex/FirstProject/DEVELOPMENT_OPTIONS.md)

## Verified commands

- Android: `./gradlew assembleDevDebug`
- Web: `npm run build`

## Immediate next steps

1. Add automated tests for booking and auth flows.
2. Introduce production-grade auth/session management.
3. Add waitlist and membership flows.
4. Decide whether to keep Next.js as the combined UI/backend surface or extract a dedicated backend service.
