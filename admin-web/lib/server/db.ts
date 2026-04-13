import { Pool } from "pg";
import { config, isPostgresEnabled } from "@/lib/config";

declare global {
  var __clubflowPgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!isPostgresEnabled()) {
    throw new Error("PostgreSQL is not configured. Set DATABASE_URL or switch APP_DATA_PROVIDER=mock.");
  }

  if (!globalThis.__clubflowPgPool) {
    globalThis.__clubflowPgPool = new Pool({
      connectionString: config.databaseUrl,
      max: 10,
      ssl: config.pgssl === "require" ? { rejectUnauthorized: false } : undefined,
    });
  }

  return globalThis.__clubflowPgPool;
}
