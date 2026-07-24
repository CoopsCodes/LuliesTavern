import { apiJson } from "@/lib/api";
import { SpinScreen } from "./spin-screen";

type Member = { member_number: string };

export default async function SpinPage() {
  const activeMembers = await apiJson<Member[]>("/members?status=active");
  return (
    <SpinScreen eligibleNumbers={activeMembers.map((m) => m.member_number)} />
  );
}
