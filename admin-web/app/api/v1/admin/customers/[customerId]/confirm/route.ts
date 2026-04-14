import { NextResponse } from "next/server";
import { adminService } from "@/lib/server/services";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params;
  const customer = await adminService.confirmCustomer(customerId);
  if (!customer) {
    return NextResponse.json({ error: { code: "not_found", message: "Customer not found." } }, { status: 404 });
  }
  return NextResponse.json({ ok: true, customer });
}
