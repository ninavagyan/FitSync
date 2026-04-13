import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { AuthUser, UserRole } from "@/lib/types";
import { adminService } from "@/lib/server/services";

export async function registerUser(input: {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  role: UserRole;
}): Promise<AuthUser> {
  const existing = await adminService.findUserByEmail(input.email);
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  return adminService.createAuthUser({
    id: randomUUID(),
    email: input.email,
    fullName: input.fullName,
    phone: input.phone,
    role: input.role,
    clubId: "00000000-0000-0000-0000-000000000001",
    passwordHash,
  });
}

export async function loginUser(input: { email: string; password: string }): Promise<AuthUser> {
  const user = await adminService.findUserByEmail(input.email);
  if (!user?.password_hash && !user?.passwordHash) {
    throw new Error("Invalid email or password.");
  }

  const passwordHash = user.password_hash ?? user.passwordHash;
  const valid = await bcrypt.compare(input.password, passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password.");
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
