import Link from "next/link";
import { headers } from "next/headers";
import { config, isAdminHost } from "@/lib/config";

const items = [
  ["/dashboard", "Dashboard"],
  ["/trainings", "Trainings"],
  ["/trainers", "Trainers"],
  ["/customers", "Customers"],
  ["/settings", "Settings"],
] as const;

export async function Sidebar() {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const prefix = isAdminHost(host) ? "" : "/admin";

  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>{config.appName}</h1>
        <p>{config.defaultClubName}</p>
      </div>
      <nav className="nav-list">
        {items.map(([href, label]) => (
          <Link key={href} href={`${prefix}${href}`} className="nav-item">
            {label}
          </Link>
        ))}
      </nav>
      <form method="post" action="/api/auth/logout" style={{ marginTop: 24 }}>
        <button className="button secondary" type="submit" style={{ width: "100%" }}>
          Logout
        </button>
      </form>
    </aside>
  );
}
