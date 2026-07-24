import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "_lulies_tavern_session";
export const RAILS_API_URL = process.env.RAILS_API_URL ?? "http://localhost:3001";

type ApiErrorBody = {
  error?: string;
  errors?: string[];
  conflict?: { member_id: number; member_name: string };
};

export class ApiError extends Error {
  status: number;
  fieldErrors: string[];
  body: ApiErrorBody;

  constructor(status: number, message: string, fieldErrors: string[] = [], body: ApiErrorBody = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.body = body;
  }
}

// Reads the session cookie set on Next's own origin (see app/login/actions.ts)
// and forwards it to Rails, which is only ever reached server-to-server.
async function forwardedHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session) headers.Cookie = `${SESSION_COOKIE}=${session.value}`;
  return headers;
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = { ...(await forwardedHeaders()), ...(init.headers as Record<string, string> | undefined) };
  return fetch(`${RAILS_API_URL}${path}`, { ...init, headers, cache: "no-store" });
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await apiFetch(path, init);

  if (!response.ok) {
    const body: ApiErrorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.error ?? "Request failed", body.errors ?? [], body);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}
