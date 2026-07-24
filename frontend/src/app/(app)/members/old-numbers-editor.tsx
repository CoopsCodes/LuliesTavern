"use client";

import { useState } from "react";

type OldNumber = { id: number; number: string; retired_on: string };

export function OldNumbersEditor({
  oldNumbers,
  onAdd,
  onRemove,
}: {
  oldNumbers: OldNumber[];
  onAdd: (formData: FormData) => Promise<void>;
  onRemove: (numberId: number) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">
          Old Member Numbers
        </span>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-sm font-semibold text-accent-green hover:underline"
          >
            + Add old number
          </button>
        )}
      </div>

      {oldNumbers.length === 0 && !adding && (
        <p className="text-sm text-text-muted">None on file.</p>
      )}

      {oldNumbers.length > 0 && (
        <ul className="flex flex-col gap-2">
          {oldNumbers.map((n) => (
            <li
              key={n.id}
              className="flex items-center justify-between rounded-lg border border-border-default px-3 py-2 text-sm"
            >
              <span>
                <span className="font-semibold text-accent-blue">
                  #{n.number}
                </span>{" "}
                <span className="text-text-muted">retired {n.retired_on}</span>
              </span>
              <form action={onRemove.bind(null, n.id)}>
                <button
                  type="submit"
                  className="text-text-muted hover:text-red-400"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <form
          action={async (formData) => {
            await onAdd(formData);
            setAdding(false);
          }}
          className="flex items-end gap-3 rounded-lg border border-dashed border-border-input p-3"
        >
          <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
            Number
            <input
              name="number"
              required
              className="rounded-md border border-border-input bg-bg-input px-2 py-1.5 text-sm text-text-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
            Date
            <input
              name="retired_on"
              type="date"
              required
              className="rounded-md border border-border-input bg-bg-input px-2 py-1.5 text-sm text-text-primary"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-accent-green px-3 py-1.5 text-sm font-bold text-text-on-accent"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="text-sm font-semibold text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
