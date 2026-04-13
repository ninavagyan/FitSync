import { adminFetch } from "@/lib/server/api";
import { StatusBadge } from "@/components/status-badge";
import type { Training } from "@/lib/types";

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

export default async function DashboardPage() {
  const data = await adminFetch<DashboardResponse>("/api/v1/admin/dashboard");

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
