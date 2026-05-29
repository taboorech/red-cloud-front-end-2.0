/**
 * RTK Query error shape returned by `axiosBaseQuery` when the server responds
 * with non-2xx. The server's error middleware emits one of:
 *   - `{ errors: [{ message }] }` for AppError and ZodError
 *   - `{ message }` as a fallback
 * This helper unwraps either to a human-readable string, or null when the
 * error doesn't carry one (so the caller can fall back to a generic label).
 */
export interface ApiErrorShape {
  data?: {
    errors?: { message?: string }[]
    message?: string
  }
}

export const extractApiMessage = (err: unknown): string | null => {
  const e = err as ApiErrorShape
  return e?.data?.errors?.[0]?.message ?? e?.data?.message ?? null
}
