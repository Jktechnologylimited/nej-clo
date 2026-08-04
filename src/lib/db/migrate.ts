import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "./index";

async function migrate() {
  const schemaPath = join(process.cwd(), "src/lib/db/schema.sql");
  const schemaSql = readFileSync(schemaPath, "utf-8");

  // Naive split on ";" is safe here because schema.sql only ever contains
  // plain DDL (CREATE TABLE / CREATE INDEX) — no string literals or
  // procedural blocks that could contain a semicolon of their own.
  const statements = schemaSql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  console.log(`Applying ${statements.length} statements to the database…`);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log("Schema is up to date.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
