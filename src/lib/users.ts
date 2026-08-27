import { sql } from "@/lib/db";
import type { User } from "@/lib/db/types";

const USER_COLUMNS = `
  id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt"
`;

export async function getAllUsers(): Promise<User[]> {
  const rows = await sql.query(`SELECT ${USER_COLUMNS} FROM users ORDER BY created_at DESC`);
  return rows as unknown as User[];
}

/** Order count per user, for the admin customer list. */
export async function getUserOrderCounts(): Promise<Map<string, number>> {
  const rows = (await sql`
    SELECT user_id AS "userId", COUNT(*)::int AS count
    FROM orders
    WHERE user_id IS NOT NULL
    GROUP BY user_id
  `) as { userId: string; count: number }[];

  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.userId, row.count);
  return counts;
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await sql.query(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1 LIMIT 1`, [id]);
  return (rows[0] as User) ?? null;
}

export async function isEmailTakenByAnotherUser(email: string, excludeUserId: string): Promise<boolean> {
  const rows = await sql.query(
    `SELECT id FROM users WHERE email = $1 AND id != $2 LIMIT 1`,
    [email.toLowerCase().trim(), excludeUserId],
  );
  return rows.length > 0;
}

export async function updateUserProfile(
  id: string,
  input: { name: string; email: string },
): Promise<User | null> {
  await sql`
    UPDATE users
    SET name = ${input.name}, email = ${input.email.toLowerCase().trim()}
    WHERE id = ${id}
  `;
  return getUserById(id);
}
