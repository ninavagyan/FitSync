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
- sign in as customer
- book available trainings
- cancel active bookings
- review their booking list
- log out

## Current implementation approach

The customer web app is server-rendered inside the same Next.js workspace as the admin app, but it is intentionally separated by route structure and session handling.

Main files:

- [home page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/page.tsx)
- [login page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/login/page.tsx)
- [register page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/register/page.tsx)
- [schedule page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/schedule/page.tsx)
- [bookings page](/Users/nina/Documents/Codex/FirstProject/admin-web/app/bookings/page.tsx)
- [customer web session](/Users/nina/Documents/Codex/FirstProject/admin-web/lib/server/customer-web-session.ts)

## Session model

The customer web app uses a dedicated cookie separate from the admin cookie set.

Current cookie purpose:

- identify the signed-in customer for the browser app
- keep admin and customer sessions separated
- let customer booking forms post without client-side token handling

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
