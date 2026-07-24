"use server";

import { revalidatePath } from "next/cache";
import { apiJson, ApiError } from "@/lib/api";

type Winner = {
  id: number;
  drawn_at: string;
  member_id: number;
  member_name: string;
  member_number: string;
};

export async function spin(): Promise<
  { ok: true; winner: Winner } | { ok: false; error: string }
> {
  try {
    const winner = await apiJson<Winner>("/spin", { method: "POST" });
    revalidatePath("/winners");
    return { ok: true, winner };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Something went wrong.",
    };
  }
}
