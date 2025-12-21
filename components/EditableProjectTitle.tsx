"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { renameProject } from "@/lib/api/projects";

export default function EditableProjectTitle({
  projectId,
  title,
}: {
  projectId: number;
  title: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const save = async () => {
    if (value.trim() && value !== title) {
      await renameProject(token!, projectId, value);
    }
    setEditing(false);
  };


  const cancel = () => {
    setValue(title);
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
        className="text-4xl font-bold bg-transparent border-b border-zinc-500 outline-none w-full"
      />
    );
  }

  return (
    <h1
      className="text-4xl font-bold cursor-text hover:opacity-80"
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </h1>
  );
}
