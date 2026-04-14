import Link from "next/link";
import { CustomerScheduleCalendar } from "@/components/customer-schedule-calendar";
import { getCurrentCustomerUser } from "@/lib/server/customer-web-session";
import { adminService } from "@/lib/server/services";
import type { CustomerTraining } from "@/lib/types";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type SearchParams = {
  error?: string;
  success?: string;
  month?: string;
};

function startOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function addDays(value: Date, amount: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(value: Date, amount: number) {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1);
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

function buildMonthCalendar(monthDate: Date, trainingsByDay: Record<string, CustomerTraining[]>) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = addDays(monthStart, -firstWeekday);
  const lastWeekday = (monthEnd.getDay() + 6) % 7;
  const gridEnd = addDays(monthEnd, 6 - lastWeekday);
  const todayKey = toDateKey(new Date());
  const cells: Array<{
    key: string;
    dateNumber: number;
    dateLabel: string;
    inMonth: boolean;
    isToday: boolean;
    trainings: CustomerTraining[];
  }> = [];

  for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    const key = toDateKey(cursor);
    cells.push({
      key,
      dateNumber: cursor.getDate(),
      dateLabel: formatDayLabel(cursor),
      inMonth: cursor.getMonth() === monthDate.getMonth(),
      isToday: key === todayKey,
      trainings: trainingsByDay[key] ?? [],
    });
  }

  return {
    key: toMonthKey(monthDate),
    label: formatMonthLabel(monthDate),
    cells,
  };
}

function getVisibleMonth(requestedMonth: string | undefined) {
  return parseMonthKey(requestedMonth) ?? startOfMonth(new Date());
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const user = await getCurrentCustomerUser();
  const trainings = (user
    ? await adminService.listUpcomingTrainingsForCustomer(user.id)
    : (await adminService.listTrainings())
        .filter((training) => ["scheduled", "full"].includes(training.status))
        .filter((training) => new Date(training.endAt).getTime() > Date.now())
        .map((training) => ({ ...training, isUserBooked: false })))
    .filter((training) => training.status !== "draft");

  const trainingsByDay = trainings.reduce<Record<string, CustomerTraining[]>>((acc, training) => {
    const key = toDateKey(training.startAt);
    acc[key] ??= [];
    acc[key].push(training);
    return acc;
  }, {});

  const visibleMonth = getVisibleMonth(params.month);
  const month = buildMonthCalendar(visibleMonth, trainingsByDay);
  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);
  const activeMonthKey = toMonthKey(visibleMonth);
  const loginRedirectHref = `/login?redirect=${encodeURIComponent(`/schedule?month=${activeMonthKey}`)}`;

  return (
    <div className="customer-shell compact">
      <header className="customer-topbar compact">
        <div>
          <span className="eyebrow">Customer app</span>
          <h1>Schedule</h1>
        </div>
        <nav className="customer-nav">
          <Link href="/">Home</Link>
          {user ? <Link href="/bookings">My bookings</Link> : <Link href="/login">Login</Link>}
          {user ? (
            <form method="post" action="/api/site/auth/logout">
              <button className="button secondary" type="submit">Logout</button>
            </form>
          ) : (
            <Link className="button primary" href="/register">Register</Link>
          )}
        </nav>
      </header>

      {params.error ? <p className="badge danger">{decodeURIComponent(params.error)}</p> : null}
      {params.success ? <p className="badge">{decodeURIComponent(params.success)}</p> : null}

      <section className="calendar-summary">
        <div className="calendar-summary-card">
          <strong>{trainings.length}</strong>
          <span>Upcoming trainings available to browse</span>
        </div>
        <div className="calendar-summary-card">
          <strong>{user ? "Booking enabled" : "Guest mode"}</strong>
          <span>{user ? "Click a training to open a popup and confirm the booking there." : "Login to book from the calendar."}</span>
        </div>
      </section>

      <section className="calendar-month-section">
        <div className="calendar-toolbar">
          <div>
            <span className="eyebrow">Calendar view</span>
            <h3>{month.label}</h3>
          </div>
          <div className="calendar-nav">
            <Link className="button secondary calendar-arrow-button" aria-label="Previous month" href={`/schedule?month=${toMonthKey(previousMonth)}`}>
              ←
            </Link>
            <Link className="button secondary calendar-current-button" href={`/schedule?month=${toMonthKey(startOfMonth(new Date()))}`}>
              Current
            </Link>
            <Link className="button secondary calendar-arrow-button" aria-label="Next month" href={`/schedule?month=${toMonthKey(nextMonth)}`}>
              →
            </Link>
          </div>
        </div>

        <div className="calendar-grid-header">
          {DAY_NAMES.map((day) => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <CustomerScheduleCalendar
          month={month}
          activeMonthKey={activeMonthKey}
          userLoggedIn={Boolean(user)}
          loginRedirectHref={loginRedirectHref}
        />
      </section>
    </div>
  );
}
