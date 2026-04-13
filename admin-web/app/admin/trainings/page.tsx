import { adminFetch } from "@/lib/server/api";
import { StatusBadge } from "@/components/status-badge";
import type { Trainer, Training } from "@/lib/types";

export default async function TrainingsPage() {
  const [{ items: trainings }, { items: trainers }] = await Promise.all([
    adminFetch<{ items: Training[] }>("/api/v1/admin/trainings"),
    adminFetch<{ items: Trainer[] }>("/api/v1/admin/trainers"),
  ]);

  return (
    <>
      <section className="page-header">
        <div>
          <h2>Trainings</h2>
          <p>Create, review, and cancel scheduled classes.</p>
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <h3>Create training</h3>
          <p className="muted">Persisted through the configured data provider.</p>
          <form method="post" action="/api/v1/admin/trainings">
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field"><label>Name</label><input name="name" placeholder="Morning Pilates Flow" required /></div>
              <div className="field"><label>Category</label><select name="category" defaultValue="pilates"><option value="pilates">Pilates</option><option value="yoga">Yoga</option><option value="group_training">Group training</option></select></div>
              <div className="field"><label>Trainer</label><select name="trainerId" defaultValue=""><option value="">Unassigned</option>{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.fullName}</option>)}</select></div>
              <div className="field"><label>Capacity</label><input name="capacity" type="number" defaultValue={12} min={1} /></div>
              <div className="field"><label>Start</label><input name="startAt" type="datetime-local" required /></div>
              <div className="field"><label>End</label><input name="endAt" type="datetime-local" required /></div>
              <div className="field"><label>Status</label><select name="status" defaultValue="scheduled"><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="full">Full</option><option value="cancelled">Cancelled</option></select></div>
              <div className="field" style={{ gridColumn: "1 / -1" }}><label>Description</label><textarea name="description" placeholder="Class description, expectations, and room notes." /></div>
            </div>
            <div className="actions"><button className="button primary" type="submit">Save training</button><button className="button secondary" type="reset">Reset</button></div>
          </form>
        </div>

        <div className="card">
          <h3>Upcoming schedule</h3>
          <table className="table" style={{ marginTop: 12 }}>
            <thead><tr><th>Name</th><th>Trainer</th><th>Occupancy</th><th>Status</th></tr></thead>
            <tbody>
              {trainings.map((training) => (
                <tr key={training.id}>
                  <td><strong>{training.name}</strong><div className="muted">{training.startAt}</div></td>
                  <td>{training.trainerName}</td>
                  <td>{training.bookedCount}/{training.capacity}</td>
                  <td><StatusBadge value={training.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
