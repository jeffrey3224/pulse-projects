"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { renameProjectDescription } from "@/lib/api/projects";

export default function EditableProjectDescription({
  projectId,
  description,
}: {
  projectId: number;
  description: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(description);
  const inputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const save = async () => {
    if (value.trim() && value !== description) {
      await renameProjectDescription(token!, projectId, value);
    }
    setEditing(false);
  };


  const cancel = () => {
    setValue(description);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className="text-lg bg-transparent border-b border-zinc-500 outline-none w-full"
      />
    );
  }

  return (
    <h1
      className="text-lg cursor-text hover:opacity-80 pr-5 pb-2"
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </h1>
  );
}
