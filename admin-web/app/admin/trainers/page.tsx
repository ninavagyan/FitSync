import { adminFetch } from "@/lib/server/api";
import { StatusBadge } from "@/components/status-badge";
import type { Trainer } from "@/lib/types";

export default async function TrainersPage() {
  const { items: trainers } = await adminFetch<{ items: Trainer[] }>("/api/v1/admin/trainers");

  return (
    <>
      <section className="page-header"><div><h2>Trainers</h2><p>Create and manage trainer profiles used by the schedule.</p></div></section>
      <section className="grid two">
        <div className="card">
          <h3>Add trainer</h3>
          <form method="post" action="/api/v1/admin/trainers">
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field"><label>Full name</label><input name="fullName" placeholder="Mariam Hakobyan" required /></div>
              <div className="field"><label>Phone</label><input name="phone" placeholder="+374 91 100 200" /></div>
              <div className="field"><label>Email</label><input name="email" placeholder="trainer@clubflow.demo" type="email" /></div>
              <div className="field"><label>Status</label><select name="active" defaultValue="active"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              <div className="field" style={{ gridColumn: "1 / -1" }}><label>Specialties</label><input name="specialties" placeholder="Pilates, Recovery" /></div>
            </div>
            <div className="actions"><button className="button primary" type="submit">Save trainer</button></div>
          </form>
        </div>
        <div className="card">
          <h3>Trainer roster</h3>
          <div className="list" style={{ marginTop: 16 }}>
            {trainers.map((trainer) => (
              <div key={trainer.id} className="list-item">
                <div className="page-header" style={{ marginBottom: 8 }}>
                  <div><strong>{trainer.fullName}</strong><p className="muted">{trainer.email} • {trainer.phone}</p></div>
                  <StatusBadge value={trainer.active ? "active" : "inactive"} />
                </div>
                <div className="muted">Specialties: {trainer.specialties.join(", ") || "None"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
