# Admin API Contract

## Purpose

This file defines the first backend contract required by the separate admin web panel.

It covers:

- trainers
- customers
- trainings
- club settings

## Authentication and authorization

All admin endpoints require:

- authenticated user
- role in `trainer`, `manager`, or `owner`

More restrictive actions like creating trainings or changing settings should require:

- `manager` or `owner`

## Base path

Recommended base path:

- `/api/v1/admin`

## Trainers

### `GET /api/v1/admin/trainers`

Response:

```json
{
  "items": [
    {
      "id": "in_001",
      "full_name": "Mariam Hakobyan",
      "phone": "+37491100200",
      "email": "mariam@clubflow.demo",
      "bio": "Pilates and recovery specialist",
      "is_active": true
    }
  ]
}
```

### `POST /api/v1/admin/trainers`

Request:

```json
{
  "full_name": "Mariam Hakobyan",
  "phone": "+37491100200",
  "email": "mariam@clubflow.demo",
  "bio": "Pilates and recovery specialist",
  "is_active": true
}
```

### `PATCH /api/v1/admin/trainers/{trainerId}`

Request:

```json
{
  "full_name": "Mariam Hakobyan",
  "is_active": false
}
```

## Customers

### `GET /api/v1/admin/customers`

Query params:

- `search`
- `status`
- `page`
- `page_size`

Response:

```json
{
  "items": [
    {
      "id": "cu_001",
      "full_name": "Nina Sargsyan",
      "phone": "+37493111222",
      "email": "nina@example.com",
      "status": "active",
      "bookings_count": 5
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 1
}
```

### `POST /api/v1/admin/customers`

Request:

```json
{
  "full_name": "Nina Sargsyan",
  "phone": "+37493111222",
  "email": "nina@example.com",
  "status": "active"
}
```

## Trainings

### `GET /api/v1/admin/trainings`

Query params:

- `date_from`
- `date_to`
- `trainer_id`
- `category`
- `status`

Response:

```json
{
  "items": [
    {
      "id": "tr_001",
      "name": "Morning Pilates Flow",
      "description": "Core-focused class",
      "category": "pilates",
      "trainer_id": "in_001",
      "trainer_name": "Mariam Hakobyan",
      "start_at": "2026-04-12T09:00:00Z",
      "end_at": "2026-04-12T10:00:00Z",
      "capacity": 12,
      "booked_count": 7,
      "status": "scheduled"
    }
  ]
}
```

### `POST /api/v1/admin/trainings`

Request:

```json
{
  "name": "Morning Pilates Flow",
  "description": "Core-focused class",
  "category": "pilates",
  "trainer_id": "in_001",
  "start_at": "2026-04-12T09:00:00Z",
  "end_at": "2026-04-12T10:00:00Z",
  "capacity": 12,
  "status": "scheduled"
}
```

### `PATCH /api/v1/admin/trainings/{trainingId}`

Request:

```json
{
  "capacity": 14,
  "status": "scheduled"
}
```

### `POST /api/v1/admin/trainings/{trainingId}/cancel`

Request:

```json
{
  "reason": "Trainer unavailable"
}
```

Behavior:

- sets training status to `cancelled`
- prevents new bookings
- triggers customer notification workflow

### `GET /api/v1/admin/trainings/{trainingId}/bookings`

Response:

```json
{
  "training_id": "tr_001",
  "items": [
    {
      "booking_id": "bk_001",
      "customer_id": "cu_001",
      "customer_name": "Nina Sargsyan",
      "status": "active",
      "booked_at": "2026-04-10T11:00:00Z"
    }
  ]
}
```

## Settings

### `GET /api/v1/admin/settings`

Response:

```json
{
  "timezone": "Asia/Yerevan",
  "booking_cutoff_minutes": 90,
  "cancellation_cutoff_minutes": 120,
  "waitlist_enabled": true,
  "notifications_enabled": true
}
```

### `PATCH /api/v1/admin/settings`

Request:

```json
{
  "booking_cutoff_minutes": 60,
  "waitlist_enabled": false
}
```

## Error format

Recommended error response:

```json
{
  "error": {
    "code": "validation_error",
    "message": "capacity must be greater than booked count"
  }
}
```
