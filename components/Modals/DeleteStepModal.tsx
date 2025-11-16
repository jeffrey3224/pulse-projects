

type Props = {
  isOpen: boolean;
}

export default function DeleteStepModal({ isOpen }: Props) {


  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-[90%] max-w-xl">
          <h2 className="text-2xl font-bold mb-4">Confirm Delete Step?</h2>
          <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                type="submit"
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