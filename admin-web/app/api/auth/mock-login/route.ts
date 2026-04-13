import { NextResponse } from "next/server";
import { ADMIN_ROLE_COOKIE } from "@/lib/server/auth";
import { toRequestUrl } from "@/lib/server/request-url";

export async function POST(request: Request) {
  const formData = await request.formData();
  const role = String(formData.get("role") ?? "manager");
  const redirect = String(formData.get("redirect") ?? "/dashboard");

  if (!["trainer", "manager", "owner"].includes(role)) {
    return NextResponse.json({ error: { code: "invalid_role", message: "Role is invalid." } }, { status: 400 });
  }

  const response = NextResponse.redirect(toRequestUrl(request, `/admin${redirect}`));
  response.cookies.set(ADMIN_ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
