"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RAILS_API_URL, SESSION_COOKIE } from "@/lib/api";

async function performLogin(body: Record<string, unknown>) {
  const response = await fetch(`${RAILS_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    return { error: "Invalid credentials" };
  }

  const setCookie = response.headers
    .getSetCookie()
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));

  if (!setCookie) {
    return { error: "Something went wrong. Please try again." };
  }

  const value = setCookie.split(";")[0].split("=").slice(1).join("=");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/members");
}

export async function loginWithPassword(
  _prevState: unknown,
  formData: FormData,
) {
  return performLogin({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

export async function loginWithPin(_prevState: unknown, formData: FormData) {
  return performLogin({ user_id: formData.get("user_id"), pin: formData.get("pin") });
}

export async function logout() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session) {
    await fetch(`${RAILS_API_URL}/logout`, {
      method: "DELETE",
      headers: { Cookie: `${SESSION_COOKIE}=${session.value}` },
      cache: "no-store",
    }).catch(() => {});
  }

  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
