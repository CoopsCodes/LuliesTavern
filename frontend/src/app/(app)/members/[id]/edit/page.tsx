import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { MemberForm } from "../../member-form";
import { OldNumbersEditor } from "../../old-numbers-editor";
import { addOldNumber, removeOldNumber, updateMember } from "../../actions";

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  member_number: string;
  active: boolean;
  old_numbers: { id: number; number: string; retired_on: string }[];
};

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await apiFetch(`/members/${id}`);
  if (response.status === 404) notFound();
  const member: Member = await response.json();

  return (
    <div className="mx-auto flex max-w-160 flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/members"
          className="text-sm font-semibold text-text-secondary hover:text-text-primary"
        >
          ← Back
        </Link>
        <h1 className="font-heading text-[22px] font-bold text-text-primary">
          Edit Member
        </h1>
      </div>
      <Card className="flex flex-col gap-6 p-6">
        <MemberForm
          action={updateMember.bind(null, member.id)}
          member={member}
        />
        <div className="border-t border-border-default pt-5">
          <OldNumbersEditor
            oldNumbers={member.old_numbers}
            onAdd={addOldNumber.bind(null, member.id)}
            onRemove={removeOldNumber.bind(null, member.id)}
          />
        </div>
      </Card>
    </div>
  );
}
