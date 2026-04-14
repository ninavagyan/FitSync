# Admin Web Panel

## Current implementation

The admin product is implemented as part of the Next.js application in [admin-web](/Users/nina/Documents/Codex/FirstProject/admin-web).

Current admin routes:

- `/admin/login`
- `/admin/register`
- `/admin/dashboard`
- `/admin/trainings`
- `/admin/trainers`
- `/admin/customers`
- `/admin/settings`

Production intent:

- `admin.domain` should route into this admin surface
- local development can use `/admin`

## Stack

- Next.js App Router
- TypeScript
- server-rendered pages
- client-side interactive components where needed
- route handlers for form actions and APIs
- PostgreSQL via `pg`
- `bcryptjs` for current local password hashing
- `zod` for validation

## Data sources

The admin web app supports two runtime modes:

- `mock`: in-memory demo data from [admin-store.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/admin-store.ts)
- `postgres`: persistent storage through [postgres-service.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/postgres-service.ts)

The service switch is centralized in [services.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/services.ts).

## What staff can do now

### Dashboard calendar

The admin dashboard now includes a calendar operations view.

Current behavior:

- previous, current, and next month navigation
- compact training labels inside day cells
- long names truncated so the day cell stays readable
- `Add` button on each day
- click a training to open an admin popup
- edit training details in the popup
- remove training in the popup

Key files:

- [dashboard](/Users/nina/Documents/Codex/FirstProject/admin-web/app/admin/dashboard/page.tsx)
- [admin calendar component](/Users/nina/Documents/Codex/FirstProject/admin-web/components/admin-dashboard-calendar.tsx)

### Trainings

- create training
- update training
- cancel training
- remove training
- view roster

### Trainers

- create trainer
- update trainer

### Customers

The customers area now uses a table-first management flow.

Current behavior:

- customer table is shown first
- compact action buttons fit inside the table row
- add-customer form is placed below the table
- each row supports `Edit`
- pending rows support `Confirm`
- customer detail page supports profile editing
- customer detail page supports status updates
- customer detail page supports `Deactivate`
- customer detail page supports `Delete`

Pending customer approval flow:

- customer self-registers from the customer app
- account is stored in pending state
- customer cannot log in until admin confirms
- admin clicks `Confirm`
- admin sees an in-app modal, not a browser redirect or API page
- confirmation is sent with `fetch` and the current page refreshes in place

Key files:

- [customers page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/admin/customers/page.tsx)
- [customer detail page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/admin/customers/[customerId]/page.tsx)
- [confirm button modal](/Users/nina/Documents/Codex/FirstProject/admin-web/components/admin-confirm-button.tsx)
- [customer route](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/v1/admin/customers/[customerId]/route.ts)
- [confirm route](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/v1/admin/customers/[customerId]/confirm/route.ts)
- [postgres service](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/postgres-service.ts)

Important implementation note:

- the PostgreSQL `users` table does not have `updated_at`
- customer confirm/update queries were adjusted to avoid writing a non-existent column

### Settings

- update booking cutoff
- update cancellation cutoff
- enable or disable waitlist
- enable or disable notifications

### Auth

- login
- register non-customer staff accounts
- logout

## Separation from customer app

The admin surface has its own shell, middleware protection, and cookie set.

Key files:

- [admin layout](/Users/nina/Documents/Codex/FirstProject/admin-web/app/admin/layout.tsx)
- [sidebar](/Users/nina/Documents/Codex/FirstProject/admin-web/components/sidebar.tsx)
- [middleware](/Users/nina/Documents/Codex/FirstProject/admin-web/middleware.ts)
- [admin auth login route](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/auth/login/route.ts)

## Important limitations

- forms are still basic and not deeply validated on the client
- auth is local, not production-grade
- permissions are role-gated at middleware level, not fine-grained per action yet
- no attendance, reporting, payments, or memberships yet
- no audit log yet

## Recommended next admin improvements

1. Add customer search and filters in the table.
2. Add bookings roster access directly from the calendar popup.
3. Add conflict checks for overlapping trainer sessions.
4. Add audit fields and activity log.
5. Replace simple cookie session approach with stronger auth/session management.
