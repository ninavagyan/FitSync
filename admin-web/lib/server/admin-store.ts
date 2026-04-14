import { hashSync } from "bcryptjs";
import { randomUUID } from "crypto";
import type { AuthUser, ClubSettings, Customer, CustomerBooking, CustomerTraining, Trainer, Training } from "@/lib/types";
import { customers as seedCustomers, settings as seedSettings, trainers as seedTrainers, trainings as seedTrainings } from "@/lib/mock-data";

type BookingRosterItem = {
  bookingId: string;
  customerId: string;
  customerName: string;
  status: "active" | "cancelled" | "attended" | "missed";
  bookedAt: string;
};

type StoredUser = AuthUser & {
  passwordHash: string;
  isActive?: boolean;
};

type AdminState = {
  trainings: Training[];
  trainers: Trainer[];
  customers: Customer[];
  settings: ClubSettings;
  rosters: Record<string, BookingRosterItem[]>;
  users: StoredUser[];
};

declare global {
  var __clubflowAdminState: AdminState | undefined;
}

const state: AdminState = globalThis.__clubflowAdminState ?? {
  trainings: structuredClone(seedTrainings),
  trainers: structuredClone(seedTrainers),
  customers: structuredClone(seedCustomers),
  settings: structuredClone(seedSettings),
  rosters: {
    tr_001: [
      {
        bookingId: "bk_001",
        customerId: "cu_001",
        customerName: "Nina Sargsyan",
        status: "active",
        bookedAt: "2026-04-10T11:00:00Z",
      },
      {
        bookingId: "bk_002",
        customerId: "cu_002",
        customerName: "Arman Stepanyan",
        status: "active",
        bookedAt: "2026-04-10T11:15:00Z",
      },
    ],
  },
  users: [
    {
      id: "usr_001",
      email: "owner@clubflow.demo",
      fullName: "Owner Demo",
      role: "owner",
      phone: "+374 91 000 001",
      clubId: "00000000-0000-0000-0000-000000000001",
      passwordHash: hashSync("admin1234", 10),
      isActive: true,
    },
    {
      id: "cu_001",
      email: "nina@example.com",
      fullName: "Nina Sargsyan",
      role: "customer",
      phone: "+374 93 111 222",
      clubId: "00000000-0000-0000-0000-000000000001",
      passwordHash: hashSync("customer123", 10),
      isActive: true,
    },
  ],
};

globalThis.__clubflowAdminState = state;

function getTrainerName(trainerId?: string | null) {
  return state.trainers.find((item) => item.id === trainerId)?.fullName ?? "Unassigned";
}

function getCustomerRecord(customerId: string) {
  return state.customers.find((item) => item.id === customerId) ?? null;
}

function getUserRecord(userId: string) {
  return state.users.find((item) => item.id === userId) ?? null;
}

function getTrainingRecord(trainingId: string) {
  return state.trainings.find((item) => item.id === trainingId) ?? null;
}

function activeRoster(trainingId: string) {
  return (state.rosters[trainingId] ?? []).filter((item) => item.status === "active");
}

function updateTrainingCounts(trainingId: string) {
  const index = state.trainings.findIndex((item) => item.id === trainingId);
  if (index < 0) {
    return null;
  }
  const bookedCount = activeRoster(trainingId).length;
  const current = state.trainings[index];
  const nextStatus = current.status === "cancelled"
    ? "cancelled"
    : bookedCount >= current.capacity
      ? "full"
      : "scheduled";
  state.trainings[index] = {
    ...current,
    trainerName: getTrainerName(current.trainerId),
    bookedCount,
    status: nextStatus,
  };
  return state.trainings[index];
}

function assertTrainingBookable(training: Training, userId: string) {
  if (training.status !== "scheduled" && training.status !== "full") {
    throw new Error("Training is not open for booking.");
  }
  if (activeRoster(training.id).some((item) => item.customerId === userId)) {
    throw new Error("You are already booked for this training.");
  }
  const now = Date.now();
  const startsAt = new Date(training.startAt).getTime();
  const cutoffMs = state.settings.bookingCutoffMinutes * 60 * 1000;
  if (startsAt - cutoffMs <= now) {
    throw new Error("Booking cutoff has passed for this training.");
  }
  if (activeRoster(training.id).length >= training.capacity) {
    throw new Error("Training is full.");
  }
}

function assertTrainingCancelable(training: Training, userId: string) {
  const rosterItem = activeRoster(training.id).find((item) => item.customerId === userId);
  if (rosterItem === undefined) {
    throw new Error("Booking not found for this training.");
  }
  const now = Date.now();
  const startsAt = new Date(training.startAt).getTime();
  const cutoffMs = state.settings.cancellationCutoffMinutes * 60 * 1000;
  if (startsAt - cutoffMs <= now) {
    throw new Error("Cancellation cutoff has passed for this training.");
  }
}

export function getDashboardMock() {
  const openSeats = state.trainings
    .filter((item) => item.status === "scheduled")
    .reduce((sum, item) => sum + (item.capacity - item.bookedCount), 0);

  return {
    stats: {
      upcomingSessions: state.trainings.length,
      activeTrainers: state.trainers.filter((trainer) => trainer.active).length,
      customers: state.customers.length,
      openSeats,
    },
    upcomingTrainings: state.trainings,
    notes: [
      {
        title: "Waitlist policy enabled",
        body: "Auto-promotion should be handled in backend workflows.",
      },
      {
        title: "Booking cutoff reminder",
        body: `Current policy is ${state.settings.bookingCutoffMinutes} minutes before session start.`,
      },
      {
        title: "Data provider",
        body: "Application is currently using the mock provider. Set DATABASE_URL to enable PostgreSQL mode.",
      },
    ],
  };
}

export const listTrainingsMock = () => state.trainings;
export const listTrainersMock = () => state.trainers;
export const listCustomersMock = () => state.customers;
export const getSettingsMock = () => state.settings;
export const getTrainingRosterMock = (trainingId: string) => state.rosters[trainingId] ?? [];

export function createTrainingMock(input: Omit<Training, "id" | "bookedCount"> & { bookedCount?: number }) {
  const training: Training = {
    ...input,
    id: randomUUID(),
    trainerName: input.trainerName || getTrainerName(input.trainerId),
    bookedCount: input.bookedCount ?? 0,
  };
  state.trainings.unshift(training);
  return training;
}

export function updateTrainingMock(trainingId: string, input: Partial<Training>) {
  const index = state.trainings.findIndex((item) => item.id === trainingId);
  if (index < 0) return null;
  state.trainings[index] = {
    ...state.trainings[index],
    ...input,
    trainerName: getTrainerName(input.trainerId ?? state.trainings[index].trainerId),
    id: trainingId,
  };
  return updateTrainingCounts(trainingId);
}

export function cancelTrainingMock(trainingId: string) {
  return updateTrainingMock(trainingId, { status: "cancelled" });
}

export function deleteTrainingMock(trainingId: string) {
  const index = state.trainings.findIndex((item) => item.id === trainingId);
  if (index < 0) return false;
  state.trainings.splice(index, 1);
  delete state.rosters[trainingId];
  return true;
}

export function createTrainerMock(input: Omit<Trainer, "id">) {
  const trainer: Trainer = { ...input, id: randomUUID() };
  state.trainers.unshift(trainer);
  return trainer;
}

export function updateTrainerMock(trainerId: string, input: Partial<Trainer>) {
  const index = state.trainers.findIndex((item) => item.id === trainerId);
  if (index < 0) return null;
  state.trainers[index] = { ...state.trainers[index], ...input, id: trainerId };
  state.trainings = state.trainings.map((training) =>
    training.trainerId === trainerId ? { ...training, trainerName: state.trainers[index].fullName } : training,
  );
  return state.trainers[index];
}

export function createCustomerMock(input: Omit<Customer, "id" | "bookingsCount"> & { bookingsCount?: number }) {
  const customer: Customer = { ...input, id: randomUUID(), bookingsCount: input.bookingsCount ?? 0 };
  state.customers.unshift(customer);
  return customer;
}

export function getCustomerMock(customerId: string) {
  return state.customers.find((item) => item.id === customerId) ?? null;
}

export function updateCustomerMock(customerId: string, input: Partial<Customer>) {
  const index = state.customers.findIndex((item) => item.id === customerId);
  if (index < 0) return null;
  state.customers[index] = { ...state.customers[index], ...input, id: customerId, bookingsCount: state.customers[index].bookingsCount };
  const userIndex = state.users.findIndex((item) => item.id === customerId);
  if (userIndex >= 0) {
    state.users[userIndex] = {
      ...state.users[userIndex],
      fullName: input.fullName ?? state.users[userIndex].fullName,
      phone: input.phone ?? state.users[userIndex].phone,
      email: input.email ?? state.users[userIndex].email,
      isActive: input.status ? input.status === "active" : (state.users[userIndex].isActive ?? true),
    };
  }
  return state.customers[index];
}

export function deleteCustomerMock(customerId: string) {
  const customerIndex = state.customers.findIndex((item) => item.id === customerId);
  if (customerIndex < 0) return false;
  state.customers.splice(customerIndex, 1);
  const userIndex = state.users.findIndex((item) => item.id === customerId);
  if (userIndex >= 0) {
    state.users.splice(userIndex, 1);
  }
  for (const [trainingId, roster] of Object.entries(state.rosters)) {
    state.rosters[trainingId] = roster.filter((item) => item.customerId !== customerId);
    updateTrainingCounts(trainingId);
  }
  return true;
}

export function confirmCustomerMock(customerId: string) {
  const index = state.customers.findIndex((item) => item.id === customerId);
  if (index < 0) return null;
  state.customers[index] = { ...state.customers[index], status: "active" };
  const userIndex = state.users.findIndex((item) => item.id === customerId);
  if (userIndex >= 0) {
    state.users[userIndex] = { ...state.users[userIndex], isActive: true };
  }
  return state.customers[index];
}

export function updateSettingsMock(input: Partial<ClubSettings>) {
  state.settings = { ...state.settings, ...input };
  return state.settings;
}

export function listAuthUsersMock() {
  return state.users;
}

export function findUserByIdMock(userId: string) {
  return getUserRecord(userId);
}

export function createAuthUserMock(user: StoredUser & { isActive?: boolean }) {
  state.users.unshift(user);
  if (user.role === "customer" && getCustomerRecord(user.id) === null) {
    state.customers.unshift({
      id: user.id,
      fullName: user.fullName,
      phone: user.phone ?? "",
      email: user.email,
      status: "active",
      bookingsCount: 0,
    });
  }
  return user;
}

export function listUpcomingTrainingsForCustomerMock(userId: string): CustomerTraining[] {
  return state.trainings.map((training) => ({
    ...training,
    isUserBooked: activeRoster(training.id).some((item) => item.customerId === userId),
  }));
}

export function listBookingsForCustomerMock(userId: string): CustomerBooking[] {
  return state.trainings.flatMap((training) =>
    (state.rosters[training.id] ?? [])
      .filter((item) => item.customerId === userId)
      .map((item) => ({
        bookingId: item.bookingId,
        trainingId: training.id,
        trainingName: training.name,
        startAt: training.startAt,
        endAt: training.endAt,
        status: item.status,
        trainerName: training.trainerName,
      })),
  );
}

export function bookTrainingForCustomerMock(trainingId: string, userId: string) {
  const training = getTrainingRecord(trainingId);
  const user = getUserRecord(userId);
  if (training === null || user === null) {
    throw new Error("Training or user was not found.");
  }
  assertTrainingBookable(training, userId);
  const customer = getCustomerRecord(userId) ?? {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone ?? "",
    email: user.email,
    status: "active" as const,
    bookingsCount: 0,
  };
  if (getCustomerRecord(userId) === null) {
    state.customers.unshift(customer);
  }
  state.rosters[trainingId] = [
    ...(state.rosters[trainingId] ?? []),
    {
      bookingId: randomUUID(),
      customerId: userId,
      customerName: customer.fullName,
      status: "active",
      bookedAt: new Date().toISOString(),
    },
  ];
  const updated = updateTrainingCounts(trainingId);
  if (updated === null) {
    throw new Error("Training update failed.");
  }
  customer.bookingsCount = listBookingsForCustomerMock(userId).filter((item) => item.status === "active").length;
  return { ...updated, isUserBooked: true } satisfies CustomerTraining;
}

export function cancelTrainingBookingForCustomerMock(trainingId: string, userId: string) {
  const training = getTrainingRecord(trainingId);
  if (training === null) {
    throw new Error("Training was not found.");
  }
  assertTrainingCancelable(training, userId);
  state.rosters[trainingId] = (state.rosters[trainingId] ?? []).map((item) =>
    item.customerId === userId && item.status === "active"
      ? { ...item, status: "cancelled", bookedAt: item.bookedAt }
      : item,
  );
  const updated = updateTrainingCounts(trainingId);
  if (updated === null) {
    throw new Error("Training update failed.");
  }
  const customer = getCustomerRecord(userId);
  if (customer !== null) {
    customer.bookingsCount = listBookingsForCustomerMock(userId).filter((item) => item.status === "active").length;
  }
  return { ...updated, isUserBooked: false } satisfies CustomerTraining;
}
