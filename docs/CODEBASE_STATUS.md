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
- requires admin approval before a newly registered customer can log in
- supports month-based schedule calendar
- supports popup training details from the calendar
- supports booking and cancellation from the popup
- hides draft trainings from the customer schedule
- disables booking unless the training status is `scheduled`
- uses short popup action labels to keep buttons compact
- supports bookings list split into upcoming and history
- uses a customer-specific browser session cookie

## Admin web app

Current status:

- builds successfully with `npm run build`
- lives under `/admin` locally
- is designed to sit behind `admin.domain` in production
- supports admin login and registration pages
- supports trainers, customers, trainings, and settings management
- supports interactive dashboard calendar with month navigation
- supports per-day add training actions from the dashboard calendar
- supports popup edit and remove actions for trainings
- supports pending customer approval from the customer directory
- supports customer table-first management flow
- supports customer edit, deactivate, and delete actions
- uses an in-app confirmation modal for customer confirmation instead of redirecting to an API page
- supports mock mode and PostgreSQL mode

Key backend files:

- [services.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/services.ts)
- [postgres-service.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/postgres-service.ts)
- [admin-store.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/admin-store.ts)
- [middleware.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/middleware.ts)
- [admin calendar component](/Users/nina/Documents/Codex/FirstProject/admin-web/components/admin-dashboard-calendar.tsx)
- [admin confirm modal](/Users/nina/Documents/Codex/FirstProject/admin-web/components/admin-confirm-button.tsx)

## Verified now

- Android debug build passed earlier in this workspace
- admin and customer web production build passes
- customer browser auth routes compile
- customer browser booking routes compile
- admin routes compile after route split
- interactive admin dashboard calendar compiles
- customer approval flow compiles and works against PostgreSQL
- PostgreSQL customer confirm/update queries no longer reference a missing `users.updated_at` column

## Main limitations

- Android still uses simple local session persistence, not production-grade secure storage
- web auth is still a development-friendly approach, not hardened production auth
- no automated tests yet for booking transactions or auth flows
- the Next.js app is still serving UI and backend logic together
- no payments, memberships, attendance, or waitlist UI yet

## Best next development step

Add automated tests around booking, customer approval, customer management actions, auth, and admin training mutation flows, then decide whether to keep the Next.js server routes as the backend or extract a dedicated backend service.
