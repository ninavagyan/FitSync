import { NextResponse } from "next/server";
import { toRequestUrl } from "@/lib/server/request-url";
import { clearSession } from "@/lib/server/session";

export async function POST(request: Request) {
  await clearSession();
  return NextResponse.redirect(toRequestUrl(request, "/admin/login"));
}
