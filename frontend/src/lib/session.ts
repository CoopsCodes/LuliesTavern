import "server-only";
import { cache } from "react";
import { apiFetch } from "./api";

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  active: boolean;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const response = await apiFetch("/me");
  if (!response.ok) return null;
  return response.json();
});
