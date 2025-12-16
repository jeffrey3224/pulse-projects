import { useProjectStore } from "@/lib/store/projectStore";


type Props = {
  id: number;
  name: string;
}

export default function ProjectMenu({id, name}: Props) {

  const { openRenameProjectModal } = useProjectStore();

  return (
    <div className="min-w-[200px] bg-dark-gray border-1 border-zinc-700 rounded-lg absolute top-15 right-5 shadow-2xl z-20">
      <div className="flex flex-col">
        <div className="border-t border-zinc-700 hover:bg-zinc-800">
          <button className="text-left py-1 px-2" onClick={() => openRenameProjectModal(id!, name)}>
            Rename
          </button>
        </div>
        <div className="border-t border-zinc-700 hover:bg-zinc-800">
          <button className="text-left py-1 px-2">
            Edit
          </button>
        </div>
        <div className="border-t border-zinc-700 hover:bg-zinc-800">
          <button className="text-left py-1 px-2">
            Add Step
          </button>
        </div>
        <div className="border-t border-zinc-700 hover:bg-zinc-800">
          <button className="text-left py-1 px-2">
            Delete Project
          </button>
        </div>
      </div>
     
    </div>
  )
}