import { useState } from "react";

interface Props {
  value: string | number;
  type?: "text" | "number";
  onSave: (value: string) => void;
  onCancel: () => void;
}

export const EditingCell = ({
  value,
  type = "text",
  onSave,
  onCancel,
}: Props) => {
  const [draft, setDraft] = useState(String(value));

  return (
    <input
      type={type}
      value={draft}
      autoFocus
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSave(draft);
        if (e.key === "Escape") onCancel();
      }}
    />
  );
};
