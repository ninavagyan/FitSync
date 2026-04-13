import { adminFetch } from "@/lib/server/api";
import type { ClubSettings } from "@/lib/types";

export default async function SettingsPage() {
  const settings = await adminFetch<ClubSettings>("/api/v1/admin/settings");

  return (
    <>
      <section className="page-header"><div><h2>Settings</h2><p>Operational rules that should be backed by club-level configuration.</p></div></section>
      <section className="card">
        <h3>Booking policy</h3>
        <form method="post" action="/api/v1/admin/settings">
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="field"><label>Timezone</label><input name="timezone" defaultValue={settings.timezone} /></div>
            <div className="field"><label>Booking cutoff minutes</label><input name="bookingCutoffMinutes" type="number" defaultValue={settings.bookingCutoffMinutes} /></div>
            <div className="field"><label>Cancellation cutoff minutes</label><input name="cancellationCutoffMinutes" type="number" defaultValue={settings.cancellationCutoffMinutes} /></div>
            <div className="field"><label>Waitlist enabled</label><select name="waitlistEnabled" defaultValue={settings.waitlistEnabled ? "yes" : "no"}><option value="yes">Yes</option><option value="no">No</option></select></div>
            <div className="field"><label>Notifications enabled</label><select name="notificationsEnabled" defaultValue={settings.notificationsEnabled ? "yes" : "no"}><option value="yes">Yes</option><option value="no">No</option></select></div>
          </div>
          <div className="actions"><button className="button primary" type="submit">Save settings</button></div>
        </form>
      </section>
    </>
  );
}
