/**
 * ✅ Shared Result Wrapper for Server-Side Functions
 *
 * Standardized success/error shape for backend logic like `fetchUsers`, `getAllSessions`, etc.
 *
 * Use this to:
 * - Return structured outcomes instead of throwing errors
 * - Distinguish success (`ok: true`) from failure (`ok: false`)
 * - Provide typed access to the result or error payload
 *
 * ✅ On success:
 *    { ok: true, data: T }
 *
 * ❌ On failure:
 *    { ok: false, error: { code: string; message: string; cause?: unknown } }
 *
 * ⚠️ Consumers can safely narrow using `if (result.ok)` to access `.data` or `.error`.
 *
 * ---
 * ✅ Example – Simple Usage with Vercel Postgres SQL Adapter:
 *
 * // lib/server/fetchUsers.ts
 * 'use server';
 *
 * import { sql } from '@vercel/postgres';
 * import type { z } from 'zod';
 * import { userSchema } from '../schemas/user';
 * import type { ActionResult } from '@/lib/shared/types';
 *
 * export async function fetchUsers(): Promise<
 *   ActionResult<z.infer<typeof userSchema>[]>
 * > {
 *   try {
 *     const result = await sql<z.infer<typeof userSchema>>`
 *       SELECT * FROM users ORDER BY created_at DESC
 *     `;
 *     return { ok: true, data: result.rows };
 *   } catch (err) {
 *     return {
 *       ok: false,
 *       error: {
 *         code: 'DB_ERROR',
 *         message: 'Failed to fetch users.',
 *         cause: err,
 *       },
 *     };
 *   }
 * }
 *
 * ✅ Example – Consuming in a Server Component:
 *
 * // app/users/page.tsx
 * import { fetchUsers } from '@/lib/server/fetchUsers';
 *
 * export default async function UsersPage() {
 *   const result = await fetchUsers();
 *
 *   if (!result.ok) {
 *     return (
 *       <div className="error">
 *         <h2>Error loading users</h2>
 *         <p>{result.error.message}</p>
 *         //You can also optionally log `result.error.cause` to Sentry or the console
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <ul>
 *       {result.data.map((user) => (
 *         <li key={user.id}>{user.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; cause?: unknown } };
