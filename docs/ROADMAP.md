# Roadmap

## Current project state

The repository currently contains:

- Android app scaffold
- Compose home screen
- Training domain model
- Fake in-memory repository
- Room database skeleton
- Hilt setup
- Environment flavors
- Verified local debug build

The current implementation is a foundation, not a full product.

## Phase 1: Foundation

Goal:

- Make the platform structurally correct and ready for backend and admin web integration

Tasks:

- Keep build stable
- Add code quality tools
- Initialize git
- Create baseline CI
- Add design system foundations
- Decide backend path
- Define admin web architecture

## Phase 2: Customer MVP

Goal:

- Deliver the first working customer Android experience on top of a real backend

Tasks:

- Add authentication
- Add real training list API integration
- Add training details screen
- Add booking and cancellation calls
- Add customer booking history
- Add loading, error, and empty states
- Persist schedule cache in Room

## Phase 3: Admin web MVP

Goal:

- Deliver the core operations panel for club staff

Tasks:

- Add admin login
- Add trainings list and form
- Add trainer management
- Add customer listing
- Add booking roster views
- Add club settings
- Enforce role-based backend access

## Phase 4: Notifications and sync

Goal:

- Improve retention and reliability

Tasks:

- Add reminder notifications
- Add refresh worker
- Add cancelled-class notification handling
- Add offline schedule support

## Phase 5: Growth features

Goal:

- Expand into a production business platform

Tasks:

- Add waitlist
- Add attendance check-in
- Add memberships
- Add payments
- Add multi-branch club support
- Add analytics

## Immediate next tasks

Recommended order:

1. Initialize git repository
2. Add Detekt and Ktlint
3. Decide backend path: Supabase MVP or custom Kotlin backend
4. Start admin web panel structure
5. Replace fake repository with a real API-backed repository
6. Add auth and role model
7. Add training details and booking history screens

## Definition of MVP complete

The MVP should be considered complete when:

- Users can authenticate
- Users can see the upcoming schedule
- Users can book available sessions
- Users can cancel their own bookings
- Admins can create and edit trainings from the web panel
- Admins can manage trainers from the web panel
- Capacity is enforced server-side
- Cancelled and expired states behave correctly
- Notifications are working
- Internal testers can install and use the app
