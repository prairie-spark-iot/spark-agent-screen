export class ApiError extends Error {
  constructor(public status: number, public body: unknown, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 8000;

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;

  const res = await fetch(path, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  const text = await res.text();
  const body = text.trim() ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, body, `${path} → ${res.status}`);
  }

  return body as T;
}

export function get<T>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>(path, options);
}

export function post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return request<T>(path, {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
