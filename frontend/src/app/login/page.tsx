import { redirect } from "next/navigation";
import { RAILS_API_URL } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./login-form";

type StaffMember = { id: number; name: string; role: "admin" | "user" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/members");

  const staffResponse = await fetch(`${RAILS_API_URL}/staff_directory`, { cache: "no-store" });
  const staff: StaffMember[] = staffResponse.ok ? await staffResponse.json() : [];

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-page px-4 py-10">
      <LoginForm staff={staff} />
    </main>
  );
}
