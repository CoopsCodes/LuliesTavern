export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? "bg-status-success-bg text-status-success-text" : "bg-bg-input text-text-secondary"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
