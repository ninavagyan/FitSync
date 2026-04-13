import { NextResponse } from "next/server";
import { z } from "zod";
import { config } from "@/lib/config";
import { registerUser } from "@/lib/server/auth-service";
import { toRequestUrl } from "@/lib/server/request-url";
import { setCustomerSession } from "@/lib/server/customer-web-session";

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export async function POST(request: Request) {
  if (config.allowPublicRegistration === false) {
    return NextResponse.redirect(toRequestUrl(request, "/register?error=" + encodeURIComponent("Registration is disabled.")));
  }

  const formData = await request.formData();
  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success || parsed.data.password !== parsed.data.confirmPassword) {
    return NextResponse.redirect(toRequestUrl(request, "/register?error=" + encodeURIComponent("Registration data is invalid.")));
  }

  try {
    const user = await registerUser({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      password: parsed.data.password,
      role: "customer",
    });
    await setCustomerSession(user);
    return NextResponse.redirect(toRequestUrl(request, "/schedule"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.redirect(toRequestUrl(request, "/register?error=" + encodeURIComponent(message)));
  }
}
