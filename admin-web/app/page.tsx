import Link from "next/link";
import { config } from "@/lib/config";
import type { CustomerTraining } from "@/lib/types";
import { getCurrentCustomerUser } from "@/lib/server/customer-web-session";
import { adminService } from "@/lib/server/services";

function formatTimeRange(startAt: string, endAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startAt)) + " - " + new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(endAt));
}

function getPublicTrainings(trainings: Awaited<ReturnType<typeof adminService.listTrainings>>): CustomerTraining[] {
  const now = Date.now();
  return trainings
    .filter((training) => new Date(training.endAt).getTime() > now)
    .filter((training) => training.status !== "cancelled" && training.status !== "draft")
    .slice(0, 3)
    .map((training) => ({ ...training, isUserBooked: false }));
}

export default async function HomePage() {
  const user = await getCurrentCustomerUser();
  const previewTrainings = user
    ? (await adminService.listUpcomingTrainingsForCustomer(user.id)).slice(0, 3)
    : getPublicTrainings(await adminService.listTrainings());

  return (
    <div className="customer-shell">
      <header className="customer-topbar">
        <div>
          <span className="eyebrow">{config.defaultClubName}</span>
          <h1>{config.customerAppName}</h1>
        </div>
        <nav className="customer-nav">
          <Link href="/schedule">Schedule</Link>
          {user ? <Link href="/bookings">My bookings</Link> : null}
          {user ? (
            <form method="post" action="/api/site/auth/logout">
              <button className="button secondary" type="submit">Logout</button>
            </form>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link className="button primary" href="/register">Join club</Link>
            </>
          )}
        </nav>
      </header>

      <section className="customer-hero">
        <div className="hero-copy">
          <span className="eyebrow">Pilates, yoga, and group trainings</span>
          <h2>Book your next session without calling the studio.</h2>
          <p>
            Live schedule, trainer information, available seats, and instant booking status from the same system the club team uses.
          </p>
          <div className="actions">
            <Link className="button primary" href={user ? "/schedule" : "/register"}>
              {user ? "Open schedule" : "Create customer account"}
            </Link>
            <Link className="button secondary" href="/schedule">See upcoming classes</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-stat">
            <strong>{previewTrainings.length}</strong>
            <span>Upcoming classes ready to book</span>
          </div>
          <div className="hero-stat">
            <strong>{user ? "Live" : "Guest"}</strong>
            <span>{user ? `Signed in as ${user.fullName}` : "Browse first, register when ready"}</span>
          </div>
        </div>
      </section>

      <section className="customer-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">This week</span>
            <h3>{user ? "Recommended for you" : "Upcoming schedule preview"}</h3>
          </div>
          <Link href="/schedule">View full schedule</Link>
        </div>
        <div className="customer-grid">
          {previewTrainings.map((training) => (
            <article key={training.id} className="training-card">
              <div className="training-meta">
                <span className="badge neutral">{training.category.replaceAll("_", " ")}</span>
                <span className="badge">{training.bookedCount}/{training.capacity} booked</span>
              </div>
              <h4>{training.name}</h4>
              <p className="muted">{training.description || "Studio training session"}</p>
              <p className="training-detail">{formatTimeRange(training.startAt, training.endAt)}</p>
              <p className="training-detail">Trainer: {training.trainerName || "Assigned soon"}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
