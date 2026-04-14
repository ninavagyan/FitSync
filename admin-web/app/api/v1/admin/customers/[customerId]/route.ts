import { NextResponse } from "next/server";
import { toRequestUrl } from "@/lib/server/request-url";
import { adminService } from "@/lib/server/services";

export async function GET(_request: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const customer = await adminService.getCustomer(customerId);
  if (!customer) {
    return NextResponse.json({ error: { code: "not_found", message: "Customer not found." } }, { status: 404 });
  }
  return NextResponse.json(customer);
}

export async function PUT(request: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const payload = await request.json();
  const customer = await adminService.updateCustomer(customerId, {
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    status: payload.status,
  });
  if (!customer) {
    return NextResponse.json({ error: { code: "not_found", message: "Customer not found." } }, { status: 404 });
  }
  return NextResponse.json(customer);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const deleted = await adminService.deleteCustomer(customerId);
  if (!deleted) {
    return NextResponse.json({ error: { code: "not_found", message: "Customer not found." } }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const formData = await request.formData();
  const action = String(formData.get("action") ?? "save");

  if (action === "delete") {
    await adminService.deleteCustomer(customerId);
    return NextResponse.redirect(toRequestUrl(request, `/admin/customers?success=${encodeURIComponent("Customer removed.")}`));
  }

  if (action === "deactivate") {
    await adminService.updateCustomer(customerId, { status: "inactive" });
    return NextResponse.redirect(toRequestUrl(request, `/admin/customers/${customerId}?success=${encodeURIComponent("Customer deactivated.")}`));
  }

  await adminService.updateCustomer(customerId, {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    status: String(formData.get("status") ?? "active") === "inactive"
      ? "inactive"
      : String(formData.get("status") ?? "active") === "pending"
        ? "pending"
        : "active",
  });
  return NextResponse.redirect(toRequestUrl(request, `/admin/customers/${customerId}?success=${encodeURIComponent("Customer updated.")}`));
}
