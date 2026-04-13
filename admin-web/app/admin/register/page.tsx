import { config } from "@/lib/config";

export default async function AdminRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  if (config.allowPublicRegistration === false) {
    return (
      <section className="card" style={{ maxWidth: 640, margin: "80px auto" }}>
        <div className="page-header">
          <div>
            <h2>Registration disabled</h2>
            <p>Public registration is turned off for this environment.</p>
          </div>
        </div>
        <div className="actions">
          <a className="button secondary" href="/admin/login">Back to login</a>
        </div>
      </section>
    );
  }

  return (
    <section className="card" style={{ maxWidth: 640, margin: "80px auto" }}>
      <div className="page-header">
        <div>
          <h2>Create admin account</h2>
          <p>Register a new staff account for {config.defaultClubName}.</p>
        </div>
      </div>
      {params.error ? <p className="badge danger">{decodeURIComponent(params.error)}</p> : null}
      <form method="post" action="/api/auth/register">
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
            <label>Role</label>
            <select name="role" defaultValue={config.defaultRegistrationRole}>
              {config.registrationRoles.filter((role) => role !== "customer").map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" minLength={8} required />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input name="confirmPassword" type="password" minLength={8} required />
          </div>
        </div>
        <div className="actions">
          <button className="button primary" type="submit">Register</button>
          <a className="button secondary" href="/admin/login">Back to login</a>
        </div>
      </form>
    </section>
  );
}
