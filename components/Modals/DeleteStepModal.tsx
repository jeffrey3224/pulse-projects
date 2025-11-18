import { useAuth } from "@/lib/AuthContext";
import { useProjectStore } from "@/lib/store/projectStore";


type Props = {
  isOpen: boolean;
  projectId: number | null;
  stepId: number | null;
  onClose: () => void;
}

export default function DeleteStepModal({ isOpen, projectId, stepId, onClose }: Props) {


  const { deleteStep, setActiveStep } = useProjectStore();


  const {token} = useAuth();
  if (!projectId || !stepId) return null;

  const handleClose = () => {
    onClose();
    setActiveStep(null);
  }

  const handleSubmit = () => {
    
    if (!token) return

    deleteStep(token, projectId!, stepId!);
    handleClose();
  }


  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-[50%] max-w-md">
          <h2 className="text-2xl font-bold mb-4">Confirm Delete Step?</h2>
          <div className="flex justify-center gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
                onClick={handleClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-primary hover:bg-orange-400 text-black font-bold"
              >
                Delete
              </button>
            </div>
        </div>
            
      </div>
    )
  )
}