import Link from "next/link";
import { Card } from "@/components/ui/card";
import { createMember } from "../actions";
import { MemberForm } from "../member-form";

export default function NewMemberPage() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/members" className="text-sm font-semibold text-text-secondary hover:text-text-primary">
          ← Back
        </Link>
        <h1 className="font-heading text-[22px] font-bold text-text-primary">Add Member</h1>
      </div>
      <Card className="p-6">
        <MemberForm action={createMember} />
      </Card>
    </div>
  );
}
