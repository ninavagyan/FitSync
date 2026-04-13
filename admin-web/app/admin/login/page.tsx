import { config } from "@/lib/config";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirect = params.redirect ?? "/dashboard";

  return (
    <section className="card" style={{ maxWidth: 520, margin: "80px auto" }}>
      <div className="page-header">
        <div>
          <h2>Admin sign in</h2>
          <p>Use your account to access {config.appName}.</p>
        </div>
      </div>
      {params.error ? <p className="badge danger">{decodeURIComponent(params.error)}</p> : null}
      <form method="post" action="/api/auth/login">
        <input type="hidden" name="redirect" value={redirect} />
        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Email</label>
            <input name="email" type="email" placeholder="owner@clubflow.demo" required />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Password</label>
            <input name="password" type="password" placeholder="admin1234" required />
          </div>
        </div>
        <div className="actions">
          <button className="button primary" type="submit">Sign in</button>
          {config.allowPublicRegistration ? <a className="button secondary" href="/admin/register">Create account</a> : null}
        </div>
      </form>
      {config.showMockLoginHints ? (
        <p className="muted" style={{ marginTop: 16 }}>
          Demo credentials in mock mode: <code>owner@clubflow.demo</code> / <code>admin1234</code>.
        </p>
      ) : null}
    </section>
  );
}
