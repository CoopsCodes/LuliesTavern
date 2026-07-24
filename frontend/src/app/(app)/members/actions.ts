"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiJson, ApiError } from "@/lib/api";

export type MemberFormState =
  | { error?: string }
  | { conflict: { memberId: number; memberName: string } }
  | undefined;

function memberPayload(formData: FormData) {
  return {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    member_number: formData.get("member_number"),
    active: formData.get("active") === "on",
    reassign_number: formData.get("reassign_number") === "true",
  };
}

function handleError(e: unknown): MemberFormState {
  if (e instanceof ApiError && e.status === 409 && e.body.conflict) {
    return {
      conflict: {
        memberId: e.body.conflict.member_id,
        memberName: e.body.conflict.member_name,
      },
    };
  }
  return {
    error:
      e instanceof ApiError
        ? e.fieldErrors.join(", ") || e.message
        : "Something went wrong.",
  };
}

export async function createMember(
  _prevState: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  try {
    await apiJson("/members", {
      method: "POST",
      body: JSON.stringify(memberPayload(formData)),
    });
  } catch (e) {
    return handleError(e);
  }
  revalidatePath("/members");
  redirect("/members");
}

export async function updateMember(
  id: number,
  _prevState: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  try {
    await apiJson(`/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify(memberPayload(formData)),
    });
  } catch (e) {
    return handleError(e);
  }
  revalidatePath("/members");
  redirect("/members");
}

export async function addOldNumber(memberId: number, formData: FormData) {
  await apiJson(`/members/${memberId}/old_numbers`, {
    method: "POST",
    body: JSON.stringify({
      number: formData.get("number"),
      retired_on: formData.get("retired_on"),
    }),
  });
  revalidatePath(`/members/${memberId}/edit`);
}

export async function removeOldNumber(memberId: number, numberId: number) {
  await apiJson(`/members/${memberId}/old_numbers/${numberId}`, {
    method: "DELETE",
  });
  revalidatePath(`/members/${memberId}/edit`);
}
