export type TrainingStatus = "draft" | "scheduled" | "full" | "cancelled" | "expired";
export type TrainingCategory = "pilates" | "yoga" | "group_training";
export type UserRole = "customer" | "trainer" | "manager" | "owner";

export type Training = {
  id: string;
  name: string;
  category: TrainingCategory;
  trainerId?: string | null;
  trainerName: string;
  description?: string;
  startAt: string;
  endAt: string;
  capacity: number;
  bookedCount: number;
  status: TrainingStatus;
};

export type CustomerTraining = Training & {
  isUserBooked: boolean;
};

export type Trainer = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  active: boolean;
  specialties: string[];
};

export type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  bookingsCount: number;
};

export type ClubSettings = {
  timezone: string;
  bookingCutoffMinutes: number;
  cancellationCutoffMinutes: number;
  waitlistEnabled: boolean;
  notificationsEnabled: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string | null;
  clubId: string;
};

export type CustomerBooking = {
  bookingId: string;
  trainingId: string;
  trainingName: string;
  startAt: string;
  endAt: string;
  status: "active" | "cancelled" | "attended" | "missed";
  trainerName: string;
};
