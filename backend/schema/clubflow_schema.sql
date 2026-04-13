create table clubs (
    id uuid primary key,
    name text not null,
    address text,
    timezone text not null,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table users (
    id uuid primary key,
    club_id uuid not null references clubs(id),
    email text not null unique,
    full_name text not null,
    phone text,
    role text not null check (role in ('customer', 'trainer', 'manager', 'owner')),
    is_active boolean not null default true,
    password_hash text,
    created_at timestamptz not null default now()
);

create table trainers (
    id uuid primary key,
    club_id uuid not null references clubs(id),
    user_id uuid references users(id),
    full_name text not null,
    phone text,
    email text,
    bio text,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table trainings (
    id uuid primary key,
    club_id uuid not null references clubs(id),
    trainer_id uuid references trainers(id),
    name text not null,
    description text not null,
    category text not null check (category in ('pilates', 'yoga', 'group_training')),
    start_at timestamptz not null,
    end_at timestamptz not null,
    capacity integer not null check (capacity > 0),
    booked_count integer not null default 0 check (booked_count >= 0),
    status text not null check (status in ('draft', 'scheduled', 'full', 'cancelled', 'expired')),
    location_name text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (end_at > start_at),
    check (booked_count <= capacity)
);

create table bookings (
    id uuid primary key,
    training_id uuid not null references trainings(id) on delete cascade,
    user_id uuid not null references users(id),
    status text not null check (status in ('active', 'cancelled', 'attended', 'missed')),
    booked_at timestamptz not null default now(),
    cancelled_at timestamptz,
    unique (training_id, user_id)
);

create table club_settings (
    club_id uuid primary key references clubs(id) on delete cascade,
    booking_cutoff_minutes integer not null default 90,
    cancellation_cutoff_minutes integer not null default 120,
    waitlist_enabled boolean not null default true,
    notifications_enabled boolean not null default true,
    updated_at timestamptz not null default now()
);

create index idx_users_club_role on users(club_id, role);
create index idx_trainers_club_active on trainers(club_id, is_active);
create index idx_trainings_club_start on trainings(club_id, start_at);
create index idx_trainings_trainer on trainings(trainer_id);
create index idx_bookings_training_status on bookings(training_id, status);
create index idx_bookings_user_status on bookings(user_id, status);
