import Link from "next/link";
import { config } from "@/lib/config";

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirect = params.redirect ?? "/schedule";

  return (
    <section className="auth-shell customer-auth-shell">
      <div className="auth-card customer-auth-card">
        <span className="eyebrow">{config.defaultClubName}</span>
        <h2>Customer login</h2>
        <p className="muted">Access your bookings, cancel before cutoff, and reserve upcoming classes.</p>
        {params.error ? <p className="badge danger">{decodeURIComponent(params.error)}</p> : null}
        <form method="post" action="/api/site/auth/login">
          <input type="hidden" name="redirect" value={redirect} />
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Email</label>
              <input name="email" type="email" required placeholder="customer@clubflow.demo" />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Password</label>
              <input name="password" type="password" required placeholder="customer123" />
            </div>
          </div>
          <div className="actions">
            <button className="button primary" type="submit">Login</button>
            <Link className="button secondary" href="/register">Create account</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
