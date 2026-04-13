import { NextResponse } from "next/server";
import { adminService } from "@/lib/server/services";
import { parseCustomerToken, readBearerToken } from "@/lib/server/auth-token";

export async function resolveCustomerApiUser(request: Request) {
  const token = readBearerToken(request.headers.get("authorization"));
  if (token === null) {
    return { error: NextResponse.json({ error: { code: "unauthorized", message: "Bearer token is required." } }, { status: 401 }) };
  }
  const payload = parseCustomerToken(token);
  if (payload === null) {
    return { error: NextResponse.json({ error: { code: "unauthorized", message: "Token is invalid." } }, { status: 401 }) };
  }
  const user = await adminService.findUserById(payload.userId);
  if (user === null) {
    return { error: NextResponse.json({ error: { code: "unauthorized", message: "User was not found." } }, { status: 401 }) };
  }
  return { user };
}
