import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon connection string to .env.local — see .env.example.",
  );
}

// The tagged-template call (sql`...`) auto-parameterizes ${...} interpolations
// — safe from SQL injection, no ORM required. sql.query(text, params) is used
// where the query needs to be built as a plain string (e.g. migrate.ts).
export const sql = neon(process.env.DATABASE_URL);
