import Link from "next/link";
import { config } from "@/lib/config";

export default async function CustomerRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="auth-shell customer-auth-shell">
      <div className="auth-card customer-auth-card wide">
        <span className="eyebrow">{config.defaultClubName}</span>
        <h2>Create customer account</h2>
        <p className="muted">Register once and keep booking from your phone or browser.</p>
        {params.error ? <p className="badge danger">{decodeURIComponent(params.error)}</p> : null}
        <form method="post" action="/api/site/auth/register">
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="field">
              <label>Full name</label>
              <input name="fullName" required />
            </div>
            <div className="field">
              <label>Phone</label>
              <input name="phone" />
            </div>
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input name="password" type="password" minLength={8} required />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Confirm password</label>
              <input name="confirmPassword" type="password" minLength={8} required />
            </div>
          </div>
          <div className="actions">
            <button className="button primary" type="submit">Register</button>
            <Link className="button secondary" href="/login">Back to login</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
