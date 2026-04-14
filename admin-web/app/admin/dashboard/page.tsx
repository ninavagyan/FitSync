import Link from "next/link";
import { AdminDashboardCalendar } from "@/components/admin-dashboard-calendar";
import { adminFetch } from "@/lib/server/api";
import { StatusBadge } from "@/components/status-badge";
import type { Trainer, Training } from "@/lib/types";

interface DashboardResponse {
  stats: {
    upcomingSessions: number;
    activeTrainers: number;
    customers: number;
    openSeats: number;
  };
  upcomingTrainings: Training[];
  notes: Array<{ title: string; body: string }>;
}

type SearchParams = {
  month?: string;
};

function startOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function endOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth() + 1, 0);
}

function addDays(value: Date, amount: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(value: Date, amount: number) {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1);
}

function toDateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMonthKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

function parseMonthKey(value: string | undefined) {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  return new Date(year, monthIndex, 1);
}

function formatMonthLabel(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(value);
}

function formatDayLabel(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(value);
}

function buildDashboardCalendar(trainings: Training[], visibleMonth: Date) {
  const today = new Date();
  const monthStart = startOfMonth(visibleMonth);
  const monthEnd = endOfMonth(visibleMonth);
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = addDays(monthStart, -firstWeekday);
  const lastWeekday = (monthEnd.getDay() + 6) % 7;
  const gridEnd = addDays(monthEnd, 6 - lastWeekday);
  const trainingsByDay = trainings.reduce<Record<string, Training[]>>((acc, training) => {
    const key = toDateKey(training.startAt);
    acc[key] ??= [];
    acc[key].push(training);
    return acc;
  }, {});

  const cells: Array<{
    key: string;
    inMonth: boolean;
    isToday: boolean;
    dateNumber: number;
    dateLabel: string;
    trainings: Training[];
  }> = [];

  for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    const key = toDateKey(cursor);
    cells.push({
      key,
      inMonth: cursor.getMonth() === visibleMonth.getMonth() && cursor.getFullYear() === visibleMonth.getFullYear(),
      isToday: key === toDateKey(today),
      dateNumber: cursor.getDate(),
      dateLabel: formatDayLabel(cursor),
      trainings: trainingsByDay[key] ?? [],
    });
  }

  return {
    label: formatMonthLabel(visibleMonth),
    cells,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const visibleMonth = parseMonthKey(params.month) ?? startOfMonth(new Date());
  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);
  const currentMonth = startOfMonth(new Date());

  const [data, trainersResponse] = await Promise.all([
    adminFetch<DashboardResponse>("/api/v1/admin/dashboard"),
    adminFetch<{ items: Trainer[] }>("/api/v1/admin/trainers"),
  ]);
  const calendar = buildDashboardCalendar(data.upcomingTrainings, visibleMonth);

  return (
    <>
      <section className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Operations snapshot for the club team.</p>
        </div>
      </section>

      <section className="grid stats">
        <div className="card dark">
          <div className="stat-value">{data.stats.upcomingSessions}</div>
          <div className="stat-label">Upcoming sessions</div>
        </div>
        <div className="card">
          <div className="stat-value">{data.stats.activeTrainers}</div>
          <div className="stat-label">Active trainers</div>
        </div>
        <div className="card">
          <div className="stat-value">{data.stats.customers}</div>
          <div className="stat-label">Customers</div>
        </div>
        <div className="card">
          <div className="stat-value">{data.stats.openSeats}</div>
          <div className="stat-label">Open seats</div>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="calendar-toolbar">
          <div>
            <h3>Schedule Calendar</h3>
            <p className="muted">{calendar.label} overview for club operations.</p>
          </div>
          <div className="calendar-nav">
            <Link className="button secondary calendar-arrow-button" aria-label="Previous month" href={`/admin/dashboard?month=${toMonthKey(previousMonth)}`}>
              ←
            </Link>
            <Link className="button secondary calendar-current-button" href={`/admin/dashboard?month=${toMonthKey(currentMonth)}`}>
              Current
            </Link>
            <Link className="button secondary calendar-arrow-button" aria-label="Next month" href={`/admin/dashboard?month=${toMonthKey(nextMonth)}`}>
              →
            </Link>
          </div>
        </div>

        <div className="calendar-grid-header admin-calendar-header">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <AdminDashboardCalendar calendar={calendar} trainers={trainersResponse.items} />
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="page-header">
            <div>
              <h3>Upcoming trainings</h3>
              <p>Classes that need occupancy attention.</p>
            </div>
          </div>
          <div className="list">
            {data.upcomingTrainings.map((training) => (
              <div key={training.id} className="list-item">
                <strong>{training.name}</strong>
                <p className="muted">
                  {training.trainerName} • {training.startAt}
                </p>
                <StatusBadge value={training.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="page-header">
            <div>
              <h3>Operational notes</h3>
              <p>Backend-driven settings and health checkpoints.</p>
            </div>
          </div>
          <div className="list">
            {data.notes.map((note) => (
              <div key={note.title} className="list-item">
                <strong>{note.title}</strong>
                <p className="muted">{note.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
