import { fetchProjects } from "@/lib/api/projects";
import { addStep } from "@/lib/api/steps";
import { useAuth } from "@/lib/AuthContext";
import { useProjectStore } from "@/lib/store/projectStore";
import { useState } from "react";

type Props = {
  projectId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newTitle: string) => void;
}

export default function AddStepModal({projectId, isOpen, onClose}: Props) {

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();
  const{ setAddingStepActiveProject, setActiveProject} = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !projectId) return ;

    try {
      setLoading(true);
      await addStep(token, projectId, title)
    }
     
    catch (err) {
      console.log(err)
    }
  
    finally {
      setLoading(false);
      handleClose();
      fetchProjects(token);
    }
  }

  const handleClose = () => {
    setAddingStepActiveProject(null);
    setActiveProject(null);
  }

  return (
    <>
    {isOpen && 
    (<div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-[90%] max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Add New Step</h2>
        <form onSubmit = {handleSubmit}>
          <input
              name="title"
              placeholder="Step title"
              onChange={(e) => setTitle(e.currentTarget.value)}
              className="w-full p-2 mb-3 rounded bg-zinc-800 text-white border border-zinc-600 focus:border-orange-500"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-primary hover:bg-orange-400 text-black font-bold"
              >
                {loading ? "Adding..." : "Add Step"}
              </button>
            </div>
          </form>
      </div> 
    </div>)
    }
    </>
  )
}