import { adminFetch } from "@/lib/server/api";
import { StatusBadge } from "@/components/status-badge";
import type { Customer } from "@/lib/types";

export default async function CustomersPage() {
  const { items: customers } = await adminFetch<{ items: Customer[] }>("/api/v1/admin/customers");

  return (
    <>
      <section className="page-header"><div><h2>Customers</h2><p>Search and manage customer profiles and booking activity.</p></div></section>
      <section className="grid two">
        <div className="card">
          <h3>Add customer</h3>
          <form method="post" action="/api/v1/admin/customers">
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field"><label>Full name</label><input name="fullName" required /></div>
              <div className="field"><label>Phone</label><input name="phone" /></div>
              <div className="field"><label>Email</label><input name="email" type="email" required /></div>
              <div className="field"><label>Status</label><select name="status" defaultValue="active"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="actions"><button className="button primary" type="submit">Save customer</button></div>
          </form>
        </div>
        <div className="card">
          <h3>Customer directory</h3>
          <table className="table" style={{ marginTop: 12 }}>
            <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Bookings</th><th>Status</th></tr></thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.fullName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>{customer.bookingsCount}</td>
                  <td><StatusBadge value={customer.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
