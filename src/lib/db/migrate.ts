import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "./index";

async function migrate() {
  const schemaPath = join(process.cwd(), "src/lib/db/schema.sql");
  const schemaSql = readFileSync(schemaPath, "utf-8");

  // Strip "-- ..." line comments before splitting on ";". This matters
  // because a comment is free-form English prose, not SQL, and can contain
  // a semicolon as ordinary punctuation (e.g. "...above; existing images
  // are migrated..." once did) — splitting on the raw text would cut a
  // statement in half at that point. Comments are for readers only, so
  // dropping them entirely before parsing statement boundaries is safe.
  // (This assumes no string literal in the file contains "--" itself, which
  // holds for a plain-DDL schema file like this one but wouldn't in general.)
  const withoutComments = schemaSql
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("--");
      return idx === -1 ? line : line.slice(0, idx);
    })
    .join("\n");

  const statements = withoutComments
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
