import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/server/customer-web-session";
import { toRequestUrl } from "@/lib/server/request-url";

export async function POST(request: Request) {
  await clearCustomerSession();
  return NextResponse.redirect(toRequestUrl(request, "/"));
}
