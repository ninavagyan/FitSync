import { NextResponse } from "next/server";
import { z } from "zod";
import { loginUser } from "@/lib/server/auth-service";
import { toRequestUrl } from "@/lib/server/request-url";
import { setSession } from "@/lib/server/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  redirect: z.string().optional(),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: formData.get("redirect"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(toRequestUrl(request, `/admin/login?error=${encodeURIComponent("Invalid credentials.")}`));
  }

  try {
    const user = await loginUser(parsed.data);
    if (user.role === "customer") {
      throw new Error("Use the customer app for customer accounts.");
    }
    await setSession(user);
    return NextResponse.redirect(toRequestUrl(request, `/admin${parsed.data.redirect ?? "/dashboard"}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return NextResponse.redirect(toRequestUrl(request, `/admin/login?error=${encodeURIComponent(message)}`));
  }
}
