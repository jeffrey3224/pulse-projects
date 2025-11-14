import { renameStep } from "@/lib/api/steps";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

type Props = {
  stepId: number | null;
  projectId: number | null;
  stepName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RenameStepModal({stepId, stepName, projectId, isOpen, onClose}: Props) {

  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const{ token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !stepId || !projectId) return ;

    try {
      
      setLoading(true);
      await renameStep(token, stepId, projectId, newName)
    }
     
    catch (err) {
      console.log(err)
    }
  
    finally {
      setLoading(false);
      onClose();
    }
      

  }

  return (
    <>
    {isOpen && 
    (<div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-[90%] max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Rename {`${stepName}`}</h2>
        <form onSubmit = {handleSubmit}>
          <input
              name="title"
              placeholder="Step title"
              onChange={(e) => setNewName(e.currentTarget.value)}
              className="w-full p-2 mb-3 rounded bg-zinc-800 text-white border border-zinc-600 focus:border-orange-500"
              required
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
                {loading ? "Adding..." : "Rename Step"}
              </button>
            </div>
          </form>
      </div>
      
    </div>)
    }
    </>
  )
}