import { NextResponse } from "next/server";
import { adminService } from "@/lib/server/services";

export async function GET(_request: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const customer = await adminService.getCustomer(customerId);
  if (!customer) {
    return NextResponse.json({ error: { code: "not_found", message: "Customer not found." } }, { status: 404 });
  }
  return NextResponse.json(customer);
}
