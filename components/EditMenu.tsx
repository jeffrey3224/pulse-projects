import { IoIosCloseCircle } from "react-icons/io";

type Props = {
  id: number;
  onClose: () => void;
}


export default function EditMenu({id, onClose}: Props) {

  return (
    <div className="min-w-[200px] bg-dark-gray border-1 border-zinc-700 rounded-lg absolute top-5 right-5 shadow-2xl">
      <div className="w-full flex justify-end py-2 px-2">
        <button onClick={onClose}>
          <IoIosCloseCircle size={25}/>
        </button>
      </div>
      <div className="flex flex-col">
        <div className="border-t border-zinc-700 hover:bg-zinc-800">
          <button className="text-left py-1 px-2">
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