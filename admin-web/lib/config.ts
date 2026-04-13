import { z } from "zod";
import type { UserRole } from "@/lib/types";

const roleListSchema = z
  .string()
  .optional()
  .transform((value) =>
    (value ?? "customer,trainer,manager,owner")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean) as UserRole[],
  );

const hostListSchema = z
  .string()
  .optional()
  .transform((value) =>
    (value ?? "admin.localhost")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("ClubFlow Admin"),
  NEXT_PUBLIC_CUSTOMER_APP_NAME: z.string().default("ClubFlow"),
  APP_DATA_PROVIDER: z.enum(["postgres", "mock"]).optional(),
  APP_AUTH_PROVIDER: z.literal("local").default("local"),
  APP_AUTH_SECRET: z.string().default("clubflow-local-auth-secret"),
  DATABASE_URL: z.string().optional().default(""),
  SESSION_COOKIE_NAME: z.string().default("clubflow_session"),
  ROLE_COOKIE_NAME: z.string().default("clubflow_admin_role"),
  CUSTOMER_SESSION_COOKIE_NAME: z.string().default("clubflow_customer_session"),
  APP_ADMIN_HOSTS: hostListSchema,
  DEFAULT_CLUB_ID: z.string().min(1).default("00000000-0000-0000-0000-000000000001"),
  DEFAULT_CLUB_NAME: z.string().default("ClubFlow Demo Club"),
  DEFAULT_TIMEZONE: z.string().default("Asia/Yerevan"),
  APP_ALLOW_PUBLIC_REGISTRATION: z.enum(["true", "false"]).default("true"),
  APP_DEFAULT_REGISTRATION_ROLE: z.enum(["customer", "trainer", "manager", "owner"]).default("manager"),
  APP_REGISTRATION_ROLES: roleListSchema,
  APP_SHOW_MOCK_LOGIN_HINTS: z.enum(["true", "false"]).default("true"),
  PGSSL: z.enum(["disable", "require"]).default("disable"),
});

const env = envSchema.parse(process.env);
const detectedProvider = env.DATABASE_URL ? "postgres" : "mock";
const allowedRegistrationRoles = env.APP_REGISTRATION_ROLES.filter((role) =>
  ["customer", "trainer", "manager", "owner"].includes(role),
);

export const config = {
  appName: env.NEXT_PUBLIC_APP_NAME,
  customerAppName: env.NEXT_PUBLIC_CUSTOMER_APP_NAME,
  dataProvider: env.APP_DATA_PROVIDER ?? detectedProvider,
  authProvider: env.APP_AUTH_PROVIDER,
  authSecret: env.APP_AUTH_SECRET,
  databaseUrl: env.DATABASE_URL,
  sessionCookie: env.SESSION_COOKIE_NAME,
  roleCookie: env.ROLE_COOKIE_NAME,
  customerSessionCookie: env.CUSTOMER_SESSION_COOKIE_NAME,
  adminHosts: env.APP_ADMIN_HOSTS,
  defaultClubId: env.DEFAULT_CLUB_ID,
  defaultClubName: env.DEFAULT_CLUB_NAME,
  defaultTimezone: env.DEFAULT_TIMEZONE,
  allowPublicRegistration: env.APP_ALLOW_PUBLIC_REGISTRATION === "true",
  defaultRegistrationRole: env.APP_DEFAULT_REGISTRATION_ROLE,
  registrationRoles: allowedRegistrationRoles.length ? allowedRegistrationRoles : (["customer", "trainer", "manager", "owner"] as UserRole[]),
  showMockLoginHints: env.APP_SHOW_MOCK_LOGIN_HINTS === "true",
  pgssl: env.PGSSL,
} as const;

export function isPostgresEnabled() {
  return config.dataProvider === "postgres" && Boolean(config.databaseUrl);
}

export function isAdminHost(host: string | null | undefined) {
  if (!host) {
    return false;
  }

  const normalized = host.toLowerCase().split(":")[0];
  return config.adminHosts.includes(normalized);
}
