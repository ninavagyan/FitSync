import { NextResponse } from "next/server";
import { z } from "zod";
import { loginUser } from "@/lib/server/auth-service";
import { createCustomerToken } from "@/lib/server/auth-token";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (parsed.success === false) {
    return NextResponse.json({ error: { code: "invalid_request", message: "Email and password are required." } }, { status: 400 });
  }
  try {
    const user = await loginUser(parsed.data);
    return NextResponse.json({ token: createCustomerToken(user), user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: { code: "login_failed", message } }, { status: 401 });
  }
}
