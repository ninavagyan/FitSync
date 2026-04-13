import { cookies, headers } from "next/headers";

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const host = headerStore.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const response = await fetch(`${protocol}://${host}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      cookie: cookieStore.toString(),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
