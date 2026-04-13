import { cookies } from "next/headers";
import { config } from "@/lib/config";
import type { AuthUser, UserRole } from "@/lib/types";

export async function setSession(user: AuthUser) {
  const store = await cookies();
  store.set(config.sessionCookie, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  store.set(config.roleCookie, user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(config.sessionCookie);
  store.delete(config.roleCookie);
}

export async function getRoleFromCookie(): Promise<UserRole | null> {
  const store = await cookies();
  const value = store.get(config.roleCookie)?.value;
  if (value === "customer" || value === "trainer" || value === "manager" || value === "owner") {
    return value;
  }
  return null;
}
