import { NextResponse } from "next/server";
import { toRequestUrl } from "@/lib/server/request-url";
import { adminService } from "@/lib/server/services";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params;
  await adminService.confirmCustomer(customerId);
  return NextResponse.redirect(toRequestUrl(request, "/admin/customers"));
}
