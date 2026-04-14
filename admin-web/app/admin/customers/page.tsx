import Link from "next/link";
import { adminFetch } from "@/lib/server/api";
import { AdminConfirmButton } from "@/components/admin-confirm-button";
import { StatusBadge } from "@/components/status-badge";
import type { Customer } from "@/lib/types";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const query = await searchParams;
  const { items: customers } = await adminFetch<{ items: Customer[] }>("/api/v1/admin/customers");

  return (
    <>
      <section className="page-header">
        <div>
          <h2>Customers</h2>
          <p>Review customers first, then add new profiles below.</p>
        </div>
      </section>
      {query.success ? <p className="badge success">{decodeURIComponent(query.success)}</p> : null}

      <section className="card">
        <div className="page-header" style={{ marginBottom: 12 }}>
          <div>
            <h3>Customer directory</h3>
            <p className="muted">Compact list with quick confirm and edit actions.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table customer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Bookings</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.fullName}</td>
                  <td>{customer.phone || "-"}</td>
                  <td>{customer.email}</td>
                  <td>{customer.bookingsCount}</td>
                  <td><StatusBadge value={customer.status} /></td>
                  <td>
                    <div className="inline-actions compact-actions">
                      <Link className="button secondary" href={`/admin/customers/${customer.id}`}>Edit</Link>
                      {customer.status === "pending" ? (
                        <AdminConfirmButton
                          action={`/api/v1/admin/customers/${customer.id}/confirm`}
                          label="Confirm"
                          title="Confirm customer"
                          message={`Confirm ${customer.fullName} and allow login?`}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="page-header" style={{ marginBottom: 12 }}>
          <div>
            <h3>Add customer</h3>
            <p className="muted">Create a customer profile manually from admin.</p>
          </div>
        </div>

        <form method="post" action="/api/v1/admin/customers">
          <div className="form-grid">
            <div className="field"><label>Full name</label><input name="fullName" required /></div>
            <div className="field"><label>Phone</label><input name="phone" /></div>
            <div className="field"><label>Email</label><input name="email" type="email" required /></div>
            <div className="field">
              <label>Status</label>
              <select name="status" defaultValue="active">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="actions"><button className="button primary" type="submit">Save</button></div>
        </form>
      </section>
    </>
  );
}
