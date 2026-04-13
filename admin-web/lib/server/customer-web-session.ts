import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import type { AuthUser } from "@/lib/types";
import { createCustomerToken, parseCustomerToken } from "@/lib/server/auth-token";
import { adminService } from "@/lib/server/services";

export async function setCustomerSession(user: AuthUser) {
  const store = await cookies();
  store.set(config.customerSessionCookie, createCustomerToken(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearCustomerSession() {
  const store = await cookies();
  store.delete(config.customerSessionCookie);
}

export async function getCurrentCustomerUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const token = store.get(config.customerSessionCookie)?.value;
  if (!token) {
    return null;
  }

  const payload = parseCustomerToken(token);
  if (!payload) {
    return null;
  }

  const user = await adminService.findUserById(payload.userId);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name ?? user.fullName,
    role: user.role,
    phone: user.phone ?? null,
    clubId: user.club_id ?? user.clubId,
  } satisfies AuthUser;
}

export async function requireCustomerUser() {
  const user = await getCurrentCustomerUser();
  if (!user || user.role !== "customer") {
    redirect("/login");
  }
  return user;
}
