# Project Overview

## Product summary

`ClubFlow` is a fitness club platform with:

- an Android customer application
- a separate admin web panel
- a shared backend and database

The platform should allow:

- Customers to browse the schedule
- Customers to register for available sessions
- Customers to cancel their own bookings
- Club staff to create and manage training sessions
- Club staff to manage trainers and customers
- The system to enforce participant limits
- The system to mark trainings as cancelled or expired

## Primary users

### Customer

Main actions:

- Sign in
- Browse upcoming trainings
- View session details
- Register for a session
- Cancel own registration
- Receive reminders and cancellation notifications

### Club admin

Main actions:

- Use the web admin panel
- Create and edit trainings
- Set trainer, time, description, and capacity
- Create and manage trainers
- Search and review customers
- Cancel a training
- View occupancy and booking activity
- Manage recurring schedule templates

### Optional coach role

Possible future actions:

- View own sessions
- Mark attendance
- See class rosters

## Main domain concepts

### Training

A training is a scheduled class with:

- Title
- Description
- Category
- Instructor
- Start time
- End time
- Capacity
- Booked count
- Status

### Booking

A booking represents a customer reserving one seat in a training.

Important constraints:

- One user should not book the same training twice
- A cancelled or expired training cannot be booked
- Capacity must not be exceeded

### Training statuses

Recommended statuses:

- `draft`
- `scheduled`
- `full`
- `cancelled`
- `in_progress`
- `expired`

## Core business rules

- A training becomes `full` when booked seats reach capacity
- A training becomes `expired` when the end time passes
- A cancelled training cannot be booked
- Booking and cancellation rules must be enforced on the backend
- The Android client may display availability, but the backend is the source of truth

## MVP scope

The first useful version should include:

- Authentication
- Upcoming schedule list
- Training details
- Booking and cancellation
- Admin web login
- Admin training management
- Admin trainer management
- Capacity tracking
- Status handling for full, cancelled, and expired
- Reminder notifications

## Future scope

After MVP, the most useful additions are:

- Waitlist
- Attendance check-in
- Memberships and payments
- Multi-branch club support
- Richer admin web dashboard
- Analytics and reporting
