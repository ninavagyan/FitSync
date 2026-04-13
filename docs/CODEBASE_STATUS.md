# Codebase Status

## Summary

The repository now contains:

- Android customer app
- customer web app
- admin web app
- shared PostgreSQL-backed backend layer inside the Next.js workspace
- shared schema and documentation

## Android app

Current status:

- builds successfully
- supports customer login and registration
- stores customer session locally
- fetches upcoming trainings from backend API
- books and cancels trainings through backend API
- supports logout

Key files:

- [ClubFlowRoot.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/ui/ClubFlowRoot.kt)
- [AuthViewModel.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/ui/auth/AuthViewModel.kt)
- [AuthScreen.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/ui/auth/AuthScreen.kt)
- [HomeViewModel.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/ui/home/HomeViewModel.kt)
- [KtorClubFlowApi.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/data/remote/KtorClubFlowApi.kt)

## Customer web app

Current status:

- builds successfully with `npm run build`
- supports customer landing page
- supports customer login and registration
- supports schedule browsing
- supports booking and cancellation
- supports bookings list
- uses a customer-specific browser session cookie

Key files:

- [customer home](/Users/nina/Documents/Codex/FirstProject/admin-web/app/page.tsx)
- [customer login](/Users/nina/Documents/Codex/FirstProject/admin-web/app/login/page.tsx)
- [customer register](/Users/nina/Documents/Codex/FirstProject/admin-web/app/register/page.tsx)
- [customer schedule](/Users/nina/Documents/Codex/FirstProject/admin-web/app/schedule/page.tsx)
- [customer bookings](/Users/nina/Documents/Codex/FirstProject/admin-web/app/bookings/page.tsx)
- [customer session helper](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/customer-web-session.ts)

## Admin web app

Current status:

- builds successfully with `npm run build`
- lives under `/admin` locally
- is designed to sit behind `admin.domain` in production
- supports admin login and registration pages
- supports trainers, customers, trainings, and settings management
- supports mock mode and PostgreSQL mode

Key backend files:

- [services.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/services.ts)
- [postgres-service.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/postgres-service.ts)
- [admin-store.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/admin-store.ts)
- [middleware.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/middleware.ts)

## Verified now

- Android debug build passed earlier in this workspace
- admin and customer web production build passes
- customer browser auth routes compile
- customer browser booking routes compile
- admin routes compile after route split

## Main limitations

- Android still uses simple local session persistence, not production-grade secure storage
- web auth is still a development-friendly approach, not hardened production auth
- no automated tests yet for booking transactions or auth flows
- the Next.js app is still serving UI and backend logic together
- no payments, memberships, attendance, or waitlist UI yet

## Best next development step

Add automated tests around booking and authentication, then decide whether to keep the Next.js server routes as the backend or extract a dedicated backend service.
