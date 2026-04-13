# Architecture Summary

1. ClubFlow is split into an Android customer app, a Next.js admin web app, and a shared backend/data layer.
2. Android is customer-facing only; admin workflows stay on web by design.
3. The admin web app currently also serves the customer API routes used by Android.
4. PostgreSQL is the intended source of truth for persistent data.
5. The system still supports a mock in-memory mode for fast local development.
6. Runtime provider selection is controlled in [admin-web/lib/config.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/config.ts).
7. Admin web stack: Next.js App Router, TypeScript, route handlers, `pg`, `zod`, `bcryptjs`.
8. Android stack: Kotlin, Jetpack Compose, Hilt, Ktor client, Coroutines/Flow, Room scaffold.
9. Android now supports customer login, registration, logout, booking, and cancellation.
10. Android stores a simple local customer session and sends bearer tokens to backend APIs.
11. Admin auth and customer auth are both local-development auth for now, not production-grade identity.
12. Shared domain revolves around users, trainers, trainings, bookings, and club settings.
13. Booking rules are enforced server-side, not trusted to the mobile UI.
14. PostgreSQL booking operations now use transactions for book and cancel flows.
15. Training capacity, booking cutoff, and cancellation cutoff are configured per club settings.
16. Android `devDebug` targets a configurable base URL and defaults to `http://10.0.2.2:3000/`.
17. A real phone must use the Mac's LAN IP instead of `10.0.2.2`.
18. Local HTTP is allowed on Android for development so it can talk to the local backend.
19. The current backend surface is good for integrated local testing but should later be extracted or hardened.
20. The next architectural fork is whether to keep Next.js as the backend surface or move business logic into a dedicated backend service.
