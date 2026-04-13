import type { ClubSettings, Customer, Trainer, Training } from "@/lib/types";

export const trainings: Training[] = [
  {
    id: "tr_001",
    name: "Morning Pilates Flow",
    description: "Core-focused class with controlled tempo and posture emphasis.",
    category: "pilates",
    trainerId: "in_001",
    trainerName: "Mariam Hakobyan",
    startAt: "2026-04-12T09:00:00+04:00",
    endAt: "2026-04-12T10:00:00+04:00",
    capacity: 12,
    bookedCount: 7,
    status: "scheduled",
  },
  {
    id: "tr_002",
    name: "Sunset Yoga",
    description: "Recovery-focused evening yoga with breathwork.",
    category: "yoga",
    trainerId: "in_002",
    trainerName: "Anna Grigoryan",
    startAt: "2026-04-12T19:00:00+04:00",
    endAt: "2026-04-12T20:00:00+04:00",
    capacity: 15,
    bookedCount: 15,
    status: "full",
  },
  {
    id: "tr_003",
    name: "Functional Group Training",
    description: "Mixed conditioning and mobility group session.",
    category: "group_training",
    trainerId: "in_003",
    trainerName: "David Petrosyan",
    startAt: "2026-04-13T18:30:00+04:00",
    endAt: "2026-04-13T19:30:00+04:00",
    capacity: 10,
    bookedCount: 4,
    status: "scheduled",
  },
];

export const trainers: Trainer[] = [
  {
    id: "in_001",
    fullName: "Mariam Hakobyan",
    phone: "+374 91 100 200",
    email: "mariam@clubflow.demo",
    active: true,
    specialties: ["Pilates", "Recovery"],
  },
  {
    id: "in_002",
    fullName: "Anna Grigoryan",
    phone: "+374 91 200 300",
    email: "anna@clubflow.demo",
    active: true,
    specialties: ["Yoga", "Breathwork"],
  },
  {
    id: "in_003",
    fullName: "David Petrosyan",
    phone: "+374 91 300 400",
    email: "david@clubflow.demo",
    active: true,
    specialties: ["Group Training", "Conditioning"],
  },
];

export const customers: Customer[] = [
  {
    id: "cu_001",
    fullName: "Nina Sargsyan",
    phone: "+374 93 111 222",
    email: "nina@example.com",
    status: "active",
    bookingsCount: 5,
  },
  {
    id: "cu_002",
    fullName: "Arman Stepanyan",
    phone: "+374 93 222 333",
    email: "arman@example.com",
    status: "active",
    bookingsCount: 2,
  },
  {
    id: "cu_003",
    fullName: "Lilit Khachatryan",
    phone: "+374 93 333 444",
    email: "lilit@example.com",
    status: "inactive",
    bookingsCount: 0,
  },
];

export const settings: ClubSettings = {
  timezone: "Asia/Yerevan",
  bookingCutoffMinutes: 90,
  cancellationCutoffMinutes: 120,
  waitlistEnabled: true,
  notificationsEnabled: true,
};
