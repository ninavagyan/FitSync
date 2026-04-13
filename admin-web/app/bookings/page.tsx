import Link from "next/link";
import { requireCustomerUser } from "@/lib/server/customer-web-session";
import { adminService } from "@/lib/server/services";
import type { CustomerBooking } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function splitBookings(bookings: CustomerBooking[]) {
  const now = Date.now();
  const upcoming: CustomerBooking[] = [];
  const history: CustomerBooking[] = [];

  for (const booking of bookings) {
    const isUpcoming = booking.status === "active" && new Date(booking.endAt).getTime() > now;
    if (isUpcoming) {
      upcoming.push(booking);
    } else {
      history.push(booking);
    }
  }

  return { upcoming, history: history.reverse() };
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const user = await requireCustomerUser();
  const bookings = await adminService.listBookingsForCustomer(user.id);
  const { upcoming, history } = splitBookings(bookings);

  return (
    <div className="customer-shell compact">
      <header className="customer-topbar compact">
        <div>
          <span className="eyebrow">My account</span>
          <h1>My bookings</h1>
        </div>
        <nav className="customer-nav">
          <Link href="/">Home</Link>
          <Link href="/schedule">Schedule</Link>
          <form method="post" action="/api/site/auth/logout">
            <button className="button secondary" type="submit">Logout</button>
          </form>
        </nav>
      </header>

      {params.error ? <p className="badge danger">{decodeURIComponent(params.error)}</p> : null}
      {params.success ? <p className="badge">{decodeURIComponent(params.success)}</p> : null}

      <section className="calendar-summary">
        <div className="calendar-summary-card">
          <strong>{upcoming.length}</strong>
          <span>Upcoming active bookings</span>
        </div>
        <div className="calendar-summary-card">
          <strong>{history.length}</strong>
          <span>Past or cancelled bookings</span>
        </div>
      </section>

      <section className="bookings-board">
        <div className="bookings-column">
          <div className="section-head">
            <div>
              <span className="eyebrow">Upcoming</span>
              <h3>Booked trainings</h3>
            </div>
          </div>

          <div className="customer-list">
            {upcoming.map((booking) => (
              <article key={booking.bookingId} className="training-row booking-row">
                <div>
                  <div className="training-meta">
                    <span className="badge">active</span>
                  </div>
                  <h3>{booking.trainingName}</h3>
                  <p className="training-detail">{formatDate(booking.startAt)} to {formatDate(booking.endAt)}</p>
                  <p className="training-detail">Trainer: {booking.trainerName || "Assigned soon"}</p>
                </div>
                <div className="training-actions stacked">
                  <form method="post" action={`/api/site/trainings/${booking.trainingId}/cancel`}>
                    <input type="hidden" name="redirectTo" value="/bookings" />
                    <button className="button secondary" type="submit">Cancel booking</button>
                  </form>
                  <Link className="button primary" href="/schedule">Find another class</Link>
                </div>
              </article>
            ))}
            {upcoming.length === 0 ? (
              <article className="training-row empty-state">
                <div>
                  <h3>No active bookings</h3>
                  <p className="muted">Book your next class from the schedule calendar.</p>
                </div>
                <Link className="button primary" href="/schedule">Open schedule</Link>
              </article>
            ) : null}
          </div>
        </div>

        <div className="bookings-column">
          <div className="section-head">
            <div>
              <span className="eyebrow">History</span>
              <h3>Past activity</h3>
            </div>
          </div>

          <div className="customer-list">
            {history.map((booking) => (
              <article key={booking.bookingId} className="training-row booking-row compact-history">
                <div>
                  <div className="training-meta">
                    <span className={`badge ${booking.status === "cancelled" ? "danger" : "neutral"}`.trim()}>
                      {booking.status}
                    </span>
                  </div>
                  <h3>{booking.trainingName}</h3>
                  <p className="training-detail">{formatDate(booking.startAt)} to {formatDate(booking.endAt)}</p>
                  <p className="training-detail">Trainer: {booking.trainerName || "Assigned soon"}</p>
                </div>
              </article>
            ))}
            {history.length === 0 ? (
              <article className="training-row empty-state">
                <div>
                  <h3>No booking history yet</h3>
                  <p className="muted">Cancelled and completed sessions will appear here.</p>
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
