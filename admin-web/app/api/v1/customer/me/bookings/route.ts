import { NextResponse } from "next/server";
import { resolveCustomerApiUser } from "@/lib/server/customer-auth";
import { adminService } from "@/lib/server/services";

export async function GET(request: Request) {
  const auth = await resolveCustomerApiUser(request);
  if (auth.error) {
    return auth.error;
  }
  return NextResponse.json({ items: await adminService.listBookingsForCustomer(auth.user.id) });
}
