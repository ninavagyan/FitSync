import { config } from "@/lib/config";
import { getRoleFromCookie } from "@/lib/server/session";
import type { UserRole } from "@/lib/types";

export const ADMIN_ROLE_COOKIE = config.roleCookie;

export async function getCurrentAdminRole(): Promise<Exclude<UserRole, "customer"> | null> {
  const role = await getRoleFromCookie();
  if (role === "trainer" || role === "manager" || role === "owner") {
    return role;
  }
  return null;
}
