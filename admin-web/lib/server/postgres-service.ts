import { randomUUID } from "crypto";
import { getPool } from "@/lib/server/db";
import { config } from "@/lib/config";
import type { AuthUser, ClubSettings, Customer, CustomerBooking, CustomerTraining, Trainer, Training, UserRole } from "@/lib/types";

async function ensureDefaultClub() {
  const pool = getPool();
  await pool.query(
    `insert into clubs (id, name, timezone, is_active)
     values ($1, $2, $3, true)
     on conflict (id) do update set name = excluded.name, timezone = excluded.timezone`,
    [config.defaultClubId, config.defaultClubName, config.defaultTimezone],
  );
  await pool.query(
    `insert into club_settings (club_id)
     values ($1)
     on conflict (club_id) do nothing`,
    [config.defaultClubId],
  );
}

function mapTraining(row: any): Training {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    trainerId: row.trainer_id,
    trainerName: row.trainer_name ?? "Unassigned",
    startAt: row.start_at instanceof Date ? row.start_at.toISOString() : row.start_at,
    endAt: row.end_at instanceof Date ? row.end_at.toISOString() : row.end_at,
    capacity: Number(row.capacity),
    bookedCount: Number(row.booked_count),
    status: row.status,
  };
}

function mapCustomerTraining(row: any): CustomerTraining {
  return {
    ...mapTraining(row),
    isUserBooked: row.is_user_booked === true,
  };
}

function mapTrainer(row: any): Trainer {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone ?? "",
    email: row.email ?? "",
    active: row.is_active,
    specialties: row.specialties ?? [],
  };
}

function mapCustomer(row: any): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone ?? "",
    email: row.email,
    status: row.is_active ? "active" : row.password_hash ? "pending" : "inactive",
    bookingsCount: Number(row.bookings_count ?? 0),
  };
}

function mapCustomerBooking(row: any): CustomerBooking {
  return {
    bookingId: row.booking_id,
    trainingId: row.training_id,
    trainingName: row.training_name,
    startAt: row.start_at instanceof Date ? row.start_at.toISOString() : row.start_at,
    endAt: row.end_at instanceof Date ? row.end_at.toISOString() : row.end_at,
    status: row.status,
    trainerName: row.trainer_name ?? "Unassigned",
  };
}

async function getTrainingByIdPg(id: string) {
  const pool = getPool();
  const result = await pool.query(
    `select t.*, tr.full_name as trainer_name
     from trainings t
     left join trainers tr on tr.id = t.trainer_id
     where t.id = $1`,
    [id],
  );
  return result.rows.map(mapTraining);
}

async function getCustomerTrainingByIdPg(trainingId: string, userId: string) {
  const pool = getPool();
  const result = await pool.query(
    `select t.*, tr.full_name as trainer_name,
            exists(
              select 1 from bookings b
              where b.training_id = t.id and b.user_id = $2 and b.status = 'active'
            ) as is_user_booked
     from trainings t
     left join trainers tr on tr.id = t.trainer_id
     where t.id = $1`,
    [trainingId, userId],
  );
  return result.rows[0] ? mapCustomerTraining(result.rows[0]) : null;
}

export async function getDashboardPg() {
  await ensureDefaultClub();
  const trainings = await listTrainingsPg();
  const trainers = await listTrainersPg();
  const customers = await listCustomersPg();
  const settings = await getSettingsPg();
  const openSeats = trainings.filter((item) => item.status === "scheduled").reduce((sum, item) => sum + (item.capacity - item.bookedCount), 0);

  return {
    stats: {
      upcomingSessions: trainings.length,
      activeTrainers: trainers.filter((trainer) => trainer.active).length,
      customers: customers.length,
      openSeats,
    },
    upcomingTrainings: trainings,
    notes: [
      { title: "PostgreSQL connected", body: "Admin data is loading from PostgreSQL." },
      { title: "Booking cutoff reminder", body: `Current policy is ${settings.bookingCutoffMinutes} minutes before session start.` },
      { title: "Operational mode", body: "Forms and auth now target persistent backend records." },
    ],
  };
}

export async function listTrainingsPg() {
  await ensureDefaultClub();
  const pool = getPool();
  const result = await pool.query(
    `select t.*, tr.full_name as trainer_name
     from trainings t
     left join trainers tr on tr.id = t.trainer_id
     where t.club_id = $1
     order by t.start_at asc`,
    [config.defaultClubId],
  );
  return result.rows.map(mapTraining);
}

export async function createTrainingPg(input: Omit<Training, "id" | "bookedCount"> & { bookedCount?: number }) {
  await ensureDefaultClub();
  const pool = getPool();
  const id = randomUUID();
  await pool.query(
    `insert into trainings (id, club_id, trainer_id, name, description, category, start_at, end_at, capacity, booked_count, status)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      id,
      config.defaultClubId,
      input.trainerId ?? null,
      input.name,
      input.description ?? "",
      input.category,
      input.startAt,
      input.endAt,
      input.capacity,
      input.bookedCount ?? 0,
      input.status,
    ],
  );
  const [training] = await getTrainingByIdPg(id);
  return training;
}

export async function updateTrainingPg(trainingId: string, input: Partial<Training>) {
  const pool = getPool();
  const current = await getTrainingByIdPg(trainingId);
  if (current.length === 0) return null;
  const existing = current[0];
  await pool.query(
    `update trainings
     set trainer_id = $2,
         name = $3,
         description = $4,
         category = $5,
         start_at = $6,
         end_at = $7,
         capacity = $8,
         booked_count = $9,
         status = $10,
         updated_at = now()
     where id = $1`,
    [
      trainingId,
      input.trainerId ?? existing.trainerId ?? null,
      input.name ?? existing.name,
      input.description ?? existing.description ?? "",
      input.category ?? existing.category,
      input.startAt ?? existing.startAt,
      input.endAt ?? existing.endAt,
      input.capacity ?? existing.capacity,
      input.bookedCount ?? existing.bookedCount,
      input.status ?? existing.status,
    ],
  );
  const [updated] = await getTrainingByIdPg(trainingId);
  return updated;
}

export async function cancelTrainingPg(trainingId: string) {
  return updateTrainingPg(trainingId, { status: "cancelled" });
}

export async function deleteTrainingPg(trainingId: string) {
  const pool = getPool();
  const result = await pool.query(`delete from trainings where id = $1 and club_id = $2`, [trainingId, config.defaultClubId]);
  return (result.rowCount ?? 0) > 0;
}

export async function listTrainersPg() {
  await ensureDefaultClub();
  const pool = getPool();
  const result = await pool.query(
    `select tr.*, coalesce(array_remove(array_agg(distinct t.category), null), '{}') as specialties
     from trainers tr
     left join trainings t on t.trainer_id = tr.id
     where tr.club_id = $1
     group by tr.id
     order by tr.full_name asc`,
    [config.defaultClubId],
  );
  return result.rows.map(mapTrainer);
}

export async function createTrainerPg(input: Omit<Trainer, "id">) {
  await ensureDefaultClub();
  const pool = getPool();
  const id = randomUUID();
  await pool.query(
    `insert into trainers (id, club_id, full_name, phone, email, bio, is_active)
     values ($1,$2,$3,$4,$5,$6,$7)`,
    [id, config.defaultClubId, input.fullName, input.phone, input.email, input.specialties.join(", "), input.active],
  );
  const result = await pool.query(
    `select tr.*, '{}'::text[] as specialties from trainers tr where tr.id = $1`,
    [id],
  );
  return mapTrainer(result.rows[0]);
}

export async function updateTrainerPg(trainerId: string, input: Partial<Trainer>) {
  const pool = getPool();
  const result = await pool.query(`select * from trainers where id = $1`, [trainerId]);
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  await pool.query(
    `update trainers set full_name = $2, phone = $3, email = $4, bio = $5, is_active = $6 where id = $1`,
    [trainerId, input.fullName ?? row.full_name, input.phone ?? row.phone, input.email ?? row.email, input.specialties?.join(", ") ?? row.bio, input.active ?? row.is_active],
  );
  const updated = await pool.query(`select *, '{}'::text[] as specialties from trainers where id = $1`, [trainerId]);
  return mapTrainer(updated.rows[0]);
}

export async function listCustomersPg() {
  await ensureDefaultClub();
  const pool = getPool();
  const result = await pool.query(
    `select u.*, count(b.id) as bookings_count
     from users u
     left join bookings b on b.user_id = u.id and b.status = 'active'
     where u.club_id = $1 and u.role = 'customer'
     group by u.id
     order by u.full_name asc`,
    [config.defaultClubId],
  );
  return result.rows.map(mapCustomer);
}

export async function createCustomerPg(input: Omit<Customer, "id" | "bookingsCount"> & { bookingsCount?: number }) {
  await ensureDefaultClub();
  const pool = getPool();
  const id = randomUUID();
  await pool.query(
    `insert into users (id, club_id, email, full_name, phone, role, is_active, password_hash)
     values ($1,$2,$3,$4,$5,'customer',$6,null)`,
    [id, config.defaultClubId, input.email, input.fullName, input.phone, input.status === "active"],
  );
  return {
    id,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    status: input.status,
    bookingsCount: input.bookingsCount ?? 0,
  };
}

export async function confirmCustomerPg(customerId: string) {
  const pool = getPool();
  await pool.query(
    `update users
     set is_active = true,
         updated_at = now()
     where id = $1 and club_id = $2 and role = 'customer'`,
    [customerId, config.defaultClubId],
  );
  return getCustomerPg(customerId);
}

export async function getCustomerPg(customerId: string) {
  const pool = getPool();
  const result = await pool.query(
    `select u.*, count(b.id) as bookings_count
     from users u
     left join bookings b on b.user_id = u.id and b.status = 'active'
     where u.id = $1
     group by u.id`,
    [customerId],
  );
  return result.rows[0] ? mapCustomer(result.rows[0]) : null;
}

export async function getSettingsPg() {
  await ensureDefaultClub();
  const pool = getPool();
  const result = await pool.query(`select * from club_settings where club_id = $1`, [config.defaultClubId]);
  const row = result.rows[0];
  return {
    timezone: config.defaultTimezone,
    bookingCutoffMinutes: row.booking_cutoff_minutes,
    cancellationCutoffMinutes: row.cancellation_cutoff_minutes,
    waitlistEnabled: row.waitlist_enabled,
    notificationsEnabled: row.notifications_enabled,
  } satisfies ClubSettings;
}

export async function updateSettingsPg(input: Partial<ClubSettings>) {
  const existing = await getSettingsPg();
  const pool = getPool();
  await pool.query(
    `update club_settings
     set booking_cutoff_minutes = $2,
         cancellation_cutoff_minutes = $3,
         waitlist_enabled = $4,
         notifications_enabled = $5,
         updated_at = now()
     where club_id = $1`,
    [
      config.defaultClubId,
      input.bookingCutoffMinutes ?? existing.bookingCutoffMinutes,
      input.cancellationCutoffMinutes ?? existing.cancellationCutoffMinutes,
      input.waitlistEnabled ?? existing.waitlistEnabled,
      input.notificationsEnabled ?? existing.notificationsEnabled,
    ],
  );
  return getSettingsPg();
}

export async function getTrainingRosterPg(trainingId: string) {
  const pool = getPool();
  const result = await pool.query(
    `select b.id as booking_id, u.id as customer_id, u.full_name as customer_name, b.status, b.booked_at
     from bookings b
     join users u on u.id = b.user_id
     where b.training_id = $1
     order by b.booked_at asc`,
    [trainingId],
  );
  return result.rows.map((row) => ({
    bookingId: row.booking_id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    status: row.status,
    bookedAt: row.booked_at instanceof Date ? row.booked_at.toISOString() : row.booked_at,
  }));
}

export async function findUserByEmailPg(email: string) {
  await ensureDefaultClub();
  const pool = getPool();
  const result = await pool.query(`select * from users where email = $1 limit 1`, [email]);
  return result.rows[0] ?? null;
}

export async function findUserByIdPg(userId: string) {
  const pool = getPool();
  const result = await pool.query(`select * from users where id = $1 limit 1`, [userId]);
  return result.rows[0] ?? null;
}

export async function createAuthUserPg(input: {
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  passwordHash: string;
  isActive?: boolean;
}) {
  await ensureDefaultClub();
  const pool = getPool();
  const id = randomUUID();
  await pool.query(
    `insert into users (id, club_id, email, full_name, phone, role, is_active, password_hash)
     values ($1,$2,$3,$4,$5,$6,true,$7)`,
    [id, config.defaultClubId, input.email, input.fullName, input.phone ?? null, input.role, input.isActive ?? true, input.passwordHash],
  );
  return {
    id,
    clubId: config.defaultClubId,
    email: input.email,
    fullName: input.fullName,
    phone: input.phone ?? null,
    role: input.role,
  } satisfies AuthUser;
}

export async function listUpcomingTrainingsForCustomerPg(userId: string) {
  await ensureDefaultClub();
  const pool = getPool();
  const result = await pool.query(
    `select t.*, tr.full_name as trainer_name,
            exists(
              select 1 from bookings b
              where b.training_id = t.id and b.user_id = $2 and b.status = 'active'
            ) as is_user_booked
     from trainings t
     left join trainers tr on tr.id = t.trainer_id
     where t.club_id = $1
     order by t.start_at asc`,
    [config.defaultClubId, userId],
  );
  return result.rows.map(mapCustomerTraining);
}

export async function listBookingsForCustomerPg(userId: string) {
  const pool = getPool();
  const result = await pool.query(
    `select b.id as booking_id, b.training_id, b.status,
            t.name as training_name, t.start_at, t.end_at,
            tr.full_name as trainer_name
     from bookings b
     join trainings t on t.id = b.training_id
     left join trainers tr on tr.id = t.trainer_id
     where b.user_id = $1
     order by t.start_at asc`,
    [userId],
  );
  return result.rows.map(mapCustomerBooking);
}

export async function bookTrainingForCustomerPg(trainingId: string, userId: string) {
  await ensureDefaultClub();
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("begin");
    const settingsResult = await client.query(`select * from club_settings where club_id = $1`, [config.defaultClubId]);
    const settings = settingsResult.rows[0];
    const trainingResult = await client.query(
      `select * from trainings where id = $1 and club_id = $2 for update`,
      [trainingId, config.defaultClubId],
    );
    if (trainingResult.rows.length === 0) {
      throw new Error("Training was not found.");
    }
    const training = trainingResult.rows[0];
    if (training.status === "cancelled" || training.status === "expired" || training.status === "draft") {
      throw new Error("Training is not open for booking.");
    }
    const existing = await client.query(
      `select id from bookings where training_id = $1 and user_id = $2 and status = 'active'`,
      [trainingId, userId],
    );
    if (existing.rows.length > 0) {
      throw new Error("You are already booked for this training.");
    }
    const cutoffAt = new Date(training.start_at).getTime() - Number(settings.booking_cutoff_minutes) * 60 * 1000;
    if (cutoffAt <= Date.now()) {
      throw new Error("Booking cutoff has passed for this training.");
    }
    if (Number(training.booked_count) >= Number(training.capacity)) {
      throw new Error("Training is full.");
    }
    await client.query(
      `insert into bookings (id, training_id, user_id, status)
       values ($1, $2, $3, 'active')`,
      [randomUUID(), trainingId, userId],
    );
    const nextCount = Number(training.booked_count) + 1;
    const nextStatus = nextCount >= Number(training.capacity) ? "full" : "scheduled";
    await client.query(
      `update trainings set booked_count = $2, status = $3, updated_at = now() where id = $1`,
      [trainingId, nextCount, nextStatus],
    );
    await client.query("commit");
    const updated = await getCustomerTrainingByIdPg(trainingId, userId);
    if (updated === null) {
      throw new Error("Training reload failed.");
    }
    return updated;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function cancelTrainingBookingForCustomerPg(trainingId: string, userId: string) {
  await ensureDefaultClub();
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("begin");
    const settingsResult = await client.query(`select * from club_settings where club_id = $1`, [config.defaultClubId]);
    const settings = settingsResult.rows[0];
    const trainingResult = await client.query(
      `select * from trainings where id = $1 and club_id = $2 for update`,
      [trainingId, config.defaultClubId],
    );
    if (trainingResult.rows.length === 0) {
      throw new Error("Training was not found.");
    }
    const training = trainingResult.rows[0];
    const bookingResult = await client.query(
      `select * from bookings where training_id = $1 and user_id = $2 and status = 'active' for update`,
      [trainingId, userId],
    );
    if (bookingResult.rows.length === 0) {
      throw new Error("Booking not found for this training.");
    }
    const trainingStartAt = new Date(training.start_at).getTime();
    if (trainingStartAt <= Date.now()) {
      throw new Error("This training has already started.");
    }
    await client.query(
      `update bookings set status = 'cancelled', cancelled_at = now() where id = $1`,
      [bookingResult.rows[0].id],
    );
    const nextCount = Math.max(0, Number(training.booked_count) - 1);
    await client.query(
      `update trainings set booked_count = $2, status = 'scheduled', updated_at = now() where id = $1`,
      [trainingId, nextCount],
    );
    await client.query("commit");
    const updated = await getCustomerTrainingByIdPg(trainingId, userId);
    if (updated === null) {
      throw new Error("Training reload failed.");
    }
    return updated;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
