# Customer Web App

## Purpose

The customer web app is the browser equivalent of the Android customer app.

It exists for customers who prefer booking from a browser, and it uses the same backend data, booking rules, and PostgreSQL source of truth.

## Current routes

Customer-facing routes:

- `/`
- `/login`
- `/register`
- `/schedule`
- `/bookings`

Supporting form routes:

- `/api/site/auth/login`
- `/api/site/auth/register`
- `/api/site/auth/logout`
- `/api/site/trainings/[trainingId]/book`
- `/api/site/trainings/[trainingId]/cancel`

## What customers can do now

- browse upcoming trainings
- register a customer account
- sign in as customer after admin approval
- navigate schedule by month
- open a training popup from the calendar
- book available trainings from the popup
- cancel active bookings
- review upcoming and historical bookings
- log out

## Registration and approval flow

Customer self-registration is not auto-approved anymore.

Current behavior:

- customer submits the register form
- backend creates the account in pending state
- customer is redirected to login with a wait-for-approval message
- customer login is blocked until the account is confirmed by admin
- admin confirms the customer from the admin customer directory
- after confirmation, the customer can log in normally

Main files:

- [register route](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/site/auth/register/route.ts)
- [login route](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/site/auth/login/route.ts)
- [auth service](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/auth-service.ts)
- [customer session helper](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/customer-web-session.ts)
- [customer auth guard](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/customer-auth.ts)

## Current schedule experience

The schedule is no longer a flat list.

Current behavior:

- monthly calendar view
- previous, current, and next month navigation
- day cells with scheduled trainings only
- draft trainings hidden from the customer surface
- popup training details instead of inline expansion
- booking and cancellation actions inside the popup
- booking button disabled unless the training is `scheduled`
- short action labels in the popup: `Book`, `Cancel`, `Login`, `Back`, `Prev`, `Next`
- current month state preserved after booking and cancellation
- keyboard close support with `Esc`
- long training names truncated so day cells keep their layout

Main files for this flow:

- [schedule page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/schedule/page.tsx)
- [calendar modal component](/Users/nina/Documents/Codex/FirstProject/admin-web/components/customer-schedule-calendar.tsx)
- [book route](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/site/trainings/[trainingId]/book/route.ts)
- [cancel route](/Users/nina/Documents/Codex/FirstProject/admin-web/app/api/site/trainings/[trainingId]/cancel/route.ts)

## Current bookings experience

The customer bookings page now separates:

- upcoming active bookings
- past or cancelled booking history

Main file:

- [bookings page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/bookings/page.tsx)

## Current implementation approach

The customer web app is server-rendered inside the same Next.js workspace as the admin app, but it is intentionally separated by route structure and session handling.

Main files:

- [home page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/page.tsx)
- [login page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/login/page.tsx)
- [register page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/register/page.tsx)
- [schedule page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/schedule/page.tsx)
- [bookings page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/bookings/page.tsx)
- [customer web session](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/customer-web-session.ts)
- [styles](/Users/nina/Documents/Codex/FirstProject/admin-web/app/globals.css)

## Session model

The customer web app uses a dedicated cookie separate from the admin cookie set.

Current cookie purpose:

- identify the signed-in customer for the browser app
- keep admin and customer sessions separated
- let customer booking forms post without client-side token handling
- reject inactive or pending customers before they can use protected customer pages

Current cookie config source:

- [config.ts](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/config.ts)

Current env key:

- `CUSTOMER_SESSION_COOKIE_NAME`

## Domain model

Intended deployment split:

- `admin.domain` -> admin app
- `domain` -> customer app

Local development split:

- customer app works on the root host
- admin app works under `/admin`
- optional host rewrite can map configured admin hosts into the admin route space

## Important current limitations

- customer web auth is still local-development auth, not production identity
- there is no password reset flow
- there is no waitlist UI yet
- there is no payments or membership flow yet
- there is no trainer-facing customer portal yet
