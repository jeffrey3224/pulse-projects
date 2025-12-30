
import { getProjectById } from "@/lib/db/projects";
import EditableProjectTitle from "./EditableProjectTitle";
import DueDateInput from "./DueDateInput";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillExclamationCircle } from "react-icons/ai";

interface ServerProjectPageProps {
  projectId: number;
}


export default async function ServerProjectPage({ projectId }: ServerProjectPageProps) {
  
  const project = await getProjectById(projectId); 

  if (!project) return <p>Project not found</p>; 
  return (
    <div className="w-full min-h-screen pt-25 bg-zinc-800 flex justify-center">
      <div className="w-[70vw] min-w-[600px] bg-[#171717] rounded-lg border-zinc-700 border-1 m-10 p-5">
        <EditableProjectTitle projectId={projectId} title={project.title}/>

        <DueDateInput 
          id={project.id}
          dueDate={project.dueDate}
        />

        <p>{project.description}</p>

        
      </div>
      
    </div>
  );
}
