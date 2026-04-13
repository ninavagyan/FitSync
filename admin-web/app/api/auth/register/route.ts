import { NextResponse } from "next/server";
import { z } from "zod";
import { config } from "@/lib/config";
import { registerUser } from "@/lib/server/auth-service";
import { toRequestUrl } from "@/lib/server/request-url";
import { setSession } from "@/lib/server/session";

const registerSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email(),
  role: z.enum(["customer", "trainer", "manager", "owner"]),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export async function POST(request: Request) {
  if (config.allowPublicRegistration === false) {
    return NextResponse.redirect(toRequestUrl(request, "/admin/register?error=" + encodeURIComponent("Registration is disabled.")));
  }

  const formData = await request.formData();
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (parsed.success === false || parsed.data.password !== parsed.data.confirmPassword) {
    return NextResponse.redirect(toRequestUrl(request, "/admin/register?error=" + encodeURIComponent("Registration data is invalid.")));
  }

  if (parsed.data.role === "customer") {
    return NextResponse.redirect(toRequestUrl(request, "/admin/register?error=" + encodeURIComponent("Customer accounts must use the customer registration flow.")));
  }

  if (config.registrationRoles.includes(parsed.data.role) === false) {
    return NextResponse.redirect(
      toRequestUrl(
        request,
        "/admin/register?error=" + encodeURIComponent("This role cannot be self-registered in the current environment."),
      ),
    );
  }

  try {
    const user = await registerUser(parsed.data);
    await setSession(user);
    return NextResponse.redirect(toRequestUrl(request, "/admin/dashboard"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.redirect(toRequestUrl(request, "/admin/register?error=" + encodeURIComponent(message)));
  }
}
