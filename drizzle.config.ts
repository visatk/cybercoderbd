import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit Configuration for Cloudflare D1
 * * This config allows management of the SQLite-compatible D1 database using 
 * Cloudflare's HTTP Control Plane API. Local file generation (e.g., `generate`)
 * relies entirely on the local schema, while database mutations (e.g., `push`, `pull`) 
 * securely utilize the configured environment credentials.
 */
export default defineConfig({
  // Specifies the database engine dialect. D1 is entirely SQLite-compliant.
  dialect: "sqlite",

  // Explicitly binds the driver package variant to Cloudflare D1 over HTTP API.
  driver: "d1-http",

  // Path to the strict TypeScript schema definitions.
  schema: "./worker/db/schema.ts",

  // Target directory where SQL migrations, snapshots, and schema pull histories are stored.
  out: "./migrations",

  // Cloudflare Account and Target Database Credentials pulled via environment variables
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
    databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
    token: process.env.CLOUDFLARE_D1_TOKEN ?? "",
  },

  // Prints all underlying generated raw SQL statements to stdout prior to execution
  verbose: true,

  // Enforces data safety by prompting for explicit confirmations when operations threaten data loss
  strict: true,
});
