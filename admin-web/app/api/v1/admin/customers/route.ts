import { NextResponse } from "next/server";
import { toRequestUrl } from "@/lib/server/request-url";
import { adminService } from "@/lib/server/services";

export async function GET() {
  return NextResponse.json({ items: await adminService.listCustomers() });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = await request.json();
    const customer = await adminService.createCustomer({
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      status: payload.status ?? "active",
    });
    return NextResponse.json(customer, { status: 201 });
  }

  const formData = await request.formData();
  await adminService.createCustomer({
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    status: String(formData.get("status") ?? "active") === "inactive" ? "inactive" : "active",
  });
  return NextResponse.redirect(toRequestUrl(request, "/customers"));
}
