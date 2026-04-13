import { NextResponse } from "next/server";
import { z } from "zod";
import { registerUser } from "@/lib/server/auth-service";
import { createCustomerToken } from "@/lib/server/auth-token";

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (parsed.success === false) {
    return NextResponse.json({ error: { code: "invalid_request", message: "Registration data is invalid." } }, { status: 400 });
  }
  try {
    const user = await registerUser({ ...parsed.data, role: "customer" });
    return NextResponse.json({ token: createCustomerToken(user), user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json({ error: { code: "registration_failed", message } }, { status: 400 });
  }
}
