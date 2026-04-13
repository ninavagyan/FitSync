import { createHmac } from "crypto";
import { config } from "@/lib/config";
import type { AuthUser, UserRole } from "@/lib/types";

type TokenPayload = {
  userId: string;
  role: UserRole;
};

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", config.authSecret).update(value).digest("base64url");
}

export function createCustomerToken(user: AuthUser) {
  const payload = encodeBase64Url(JSON.stringify({ userId: user.id, role: user.role } satisfies TokenPayload));
  return payload + "." + sign(payload);
}

export function parseCustomerToken(token: string): TokenPayload | null {
  const [payload, signature] = token.split(".");
  if (payload === undefined || signature === undefined) {
    return null;
  }
  if (sign(payload) === signature) {
    try {
      const parsed = JSON.parse(decodeBase64Url(payload)) as TokenPayload;
      if (parsed.userId.length === 0) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

export function readBearerToken(headerValue: string | null): string | null {
  if (headerValue === null) {
    return null;
  }
  const [scheme, token] = headerValue.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || token === undefined) {
    return null;
  }
  return token;
}
