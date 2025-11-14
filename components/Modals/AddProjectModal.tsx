"use client"

import { addProject } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => Promise<void>;
};

export default function AddProjectModal({ isOpen, onClose, onAdded }: Props) {
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!token) return;

    setLoading(true);

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLInputElement).value;
    const dueDate = (form.elements.namedItem("dueDate") as HTMLInputElement).value;

    await addProject(token, title, description, dueDate || undefined);

    form.reset();
    onClose();
    await onAdded();

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Project</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Project title"
            className="w-full p-2 mb-3 rounded bg-zinc-800 text-white border border-zinc-600 focus:border-orange-500"
            required
          />

          <input
            name="dueDate"
            type="date"
            className="w-full p-2 mb-3 rounded bg-zinc-800 text-white border border-zinc-600"
          />

          <textarea
            name="description"
            placeholder="Project description"
            className="w-full p-2 mb-4 rounded bg-zinc-800 text-white border border-zinc-600 focus:border-orange-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-primary hover:bg-orange-600 text-black font-bold"
            >
              {loading ? "Adding..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}