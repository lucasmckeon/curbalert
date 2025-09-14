/**
 * 🚫 DO NOT IMPORT – Reference only
 * 📄 Sample Types Reference — Typical Backend Object Setup
 *
 * Most backend objects will define up to **three core types**:
 *
 * 1. **Backend Schema** – the full Zod schema representing a database row.
 * 2. **Form Schema** – the schema used to validate client-submitted form data.
 *    - This is usually a subset of the backend schema (e.g. no `id`, `createdAt`, etc.).
 * 3. **Form State Type** – the shape of `useActionState` used in form submissions.
 *
 * Not every object will need all three:
 * - If an object is never used in a form, the form schema and state type can be omitted.
 * - The backend schema is typically always defined.
 *
 * This file serves as a reference pattern for defining types and schemas in a clean, consistent way.
 */

import { z } from 'zod';

export const TastingSessionFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(), // optional free-text
  wines: z
    .string()
    .min(1, 'At least one wine is required')
    .transform((val) =>
      val
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean)
    ), // transforms into array of wines
});

export type TastingSessionFormSchema = z.infer<typeof TastingSessionFormSchema>;

export const TastingSessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(), // TODO refine if long text needs special handling
});
export type TastingSessionFormState = {
  success: boolean;
  message: string | null;
  errors?: Record<string, string[] | undefined>;
};
export type TastingSession = z.infer<typeof TastingSessionSchema>;
