/**
 * Standard API response envelope (matches backend ApiResponse).
 * All backend APIs return { success, data, message?, error? }.
 */

export interface ApiErrorDetail {
  code: string;
  message: string;
  detail?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string | null;
  error?: ApiErrorDetail | null;
}

/** Thrown when the backend returns 401 (no/invalid session). */
export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

/**
 * Parse a fetch Response that returns the standard envelope.
 * Returns data on success; throws UnauthorizedError on 401, Error with message on other errors.
 */
export async function parseApiResponse<T>(res: Response): Promise<T | null> {
  let body: ApiResponse<T>;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Request failed: ${res.status}`);
  }

  if (res.status === 401) {
    throw new UnauthorizedError();
  }

  if (!res.ok) {
    const msg = body.error?.message ?? body.message ?? body.error?.code ?? "Request failed";
    throw new Error(msg);
  }

  if (!body.success && body.error) {
    throw new Error(body.error.message || body.error.code);
  }

  return body.data ?? null;
}

/** Like parseApiResponse but throws if data is null (for endpoints that always return payload). */
export async function parseApiResponseRequired<T>(res: Response): Promise<T> {
  const data = await parseApiResponse<T>(res);
  if (data === null && res.ok) {
    throw new Error("Unexpected empty response");
  }
  return data as T;
}
