"use server";

import { revalidatePath } from "next/cache";
import { apiJson, ApiError } from "@/lib/api";

export type MyAccountState = { error?: string; success?: boolean } | undefined;

export async function updateMyAccount(
  _prevState: MyAccountState,
  formData: FormData,
): Promise<MyAccountState> {
  const password = formData.get("password");
  const pin = formData.get("pin");
  const payload: Record<string, unknown> = {};
  if (password) payload.password = password;
  if (pin) payload.pin = pin;

  if (Object.keys(payload).length === 0) return { success: true };

  try {
    await apiJson("/me", { method: "PATCH", body: JSON.stringify(payload) });
  } catch (e) {
    return {
      error:
        e instanceof ApiError
          ? e.fieldErrors.join(", ") || e.message
          : "Something went wrong.",
    };
  }
  return { success: true };
}

export type StaffFormState = { error?: string; success?: boolean } | undefined;

export async function createStaffAccount(
  _prevState: StaffFormState,
  formData: FormData,
): Promise<StaffFormState> {
  try {
    await apiJson("/admin/users", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        pin: formData.get("pin"),
        role: formData.get("role"),
      }),
    });
  } catch (e) {
    return {
      error:
        e instanceof ApiError
          ? e.fieldErrors.join(", ") || e.message
          : "Something went wrong.",
    };
  }
  revalidatePath("/settings");
  return { success: true };
}

export async function toggleStaffActive(userId: number, active: boolean) {
  await apiJson(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
  revalidatePath("/settings");
}
