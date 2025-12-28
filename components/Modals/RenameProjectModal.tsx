import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useProjectStore } from "@/lib/store/projectStore";
import { renameProject as apiRenameProject } from "@/lib/api/projects";

export default function RenameProjectModal() {
  const { token } = useAuth();

  const {
    renamingProjectId,
    renamingProjectName,
    projects,
    setProjects,
    closeRenameProjectModal,
    setActiveProject,
  } = useProjectStore();

  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewName(renamingProjectName ?? "");
  }, [renamingProjectName]);

  if (!renamingProjectId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);

      await apiRenameProject(token, renamingProjectId, newName);

      const updatedProjects = projects.map((p) =>
        p.id === renamingProjectId ? { ...p, title: newName } : p
      );
      setProjects(updatedProjects);
    } 
      catch (err) {
      console.error("Failed to rename project:", err);
    } 
      finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    closeRenameProjectModal();
    setActiveProject(null);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-[90%] max-w-xl">
        <h2 className="text-2xl font-bold mb-4">
          Rename Project “{renamingProjectName}”
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            className="w-full p-2 mb-3 rounded bg-zinc-800 text-white border border-zinc-600 focus:border-orange-500"
            required
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded bg-zinc-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !newName.trim()}
              className="px-4 py-2 rounded bg-primary text-black font-bold"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
