/**
 * Safely parse a fetch Response body as JSON.
 * Avoids "Unexpected end of JSON input" when the body is empty or non-JSON (e.g. HTML error pages).
 */
export async function parseJsonResponse<T extends Record<string, unknown>>(
  res: Response
): Promise<T | null> {
  const text = await res.text()
  if (!text.trim()) return null
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}
