import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/server/api";
import { AdminConfirmButton } from "@/components/admin-confirm-button";
import { StatusBadge } from "@/components/status-badge";
import type { Customer } from "@/lib/types";

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ customerId: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { customerId } = await params;
  const query = await searchParams;
  let customer: Customer;

  try {
    customer = await adminFetch<Customer>(`/api/v1/admin/customers/${customerId}`);
  } catch {
    notFound();
  }

  return (
    <>
      <section className="page-header">
        <div>
          <h2>Edit customer</h2>
          <p>Review approval state and update customer profile details.</p>
        </div>
        <Link className="button secondary" href="/admin/customers">Back</Link>
      </section>

      {query.success ? <p className="badge success">{decodeURIComponent(query.success)}</p> : null}

      <section className="grid two">
        <div className="card">
          <div className="page-header">
            <div>
              <h3>{customer.fullName}</h3>
              <p className="muted">{customer.email}</p>
            </div>
            <StatusBadge value={customer.status} />
          </div>

          <form method="post" action={`/api/v1/admin/customers/${customer.id}`}>
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field"><label>Full name</label><input name="fullName" defaultValue={customer.fullName} required /></div>
              <div className="field"><label>Phone</label><input name="phone" defaultValue={customer.phone} /></div>
              <div className="field"><label>Email</label><input name="email" type="email" defaultValue={customer.email} required /></div>
              <div className="field">
                <label>Status</label>
                <select name="status" defaultValue={customer.status}>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="actions">
              <button className="button primary" type="submit">Save</button>
            </div>
          </form>
        </div>

        <div className="card">
          <h3>Approval</h3>
          <p className="muted">Pending customers cannot log in until the admin confirms them.</p>
          <div className="list" style={{ marginTop: 16 }}>
            <div className="list-item">
              <strong>Bookings</strong>
              <p className="muted">{customer.bookingsCount} active bookings</p>
            </div>
            <div className="list-item">
              <strong>Current status</strong>
              <p className="muted">{customer.status}</p>
            </div>
          </div>
          <div className="inline-actions" style={{ marginTop: 16 }}>
            {customer.status === "pending" ? (
              <AdminConfirmButton
                action={`/api/v1/admin/customers/${customer.id}/confirm`}
                label="Confirm"
                title="Confirm customer"
                message={`Confirm ${customer.fullName} and allow login?`}
              />
            ) : null}
            {customer.status !== "inactive" ? (
              <form method="post" action={`/api/v1/admin/customers/${customer.id}`}>
                <input type="hidden" name="action" value="deactivate" />
                <button className="button secondary" type="submit">Deactivate</button>
              </form>
            ) : null}
            <form method="post" action={`/api/v1/admin/customers/${customer.id}`}>
              <input type="hidden" name="action" value="delete" />
              <button className="button secondary danger-action" type="submit">Delete</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
