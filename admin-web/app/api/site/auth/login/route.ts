import { NextResponse } from "next/server";
import { z } from "zod";
import { loginUser } from "@/lib/server/auth-service";
import { toRequestUrl } from "@/lib/server/request-url";
import { setCustomerSession } from "@/lib/server/customer-web-session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  redirect: z.string().optional(),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: formData.get("redirect"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(toRequestUrl(request, "/login?error=" + encodeURIComponent("Email and password are required.")));
  }

  try {
    const user = await loginUser(parsed.data);
    if (user.role !== "customer") {
      throw new Error("Use the admin portal for non-customer accounts.");
    }
    await setCustomerSession(user);
    return NextResponse.redirect(toRequestUrl(request, parsed.data.redirect ?? "/schedule"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return NextResponse.redirect(toRequestUrl(request, "/login?error=" + encodeURIComponent(message)));
  }
}
