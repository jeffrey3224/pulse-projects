
import { getProjectById } from "@/lib/db/projects";
import EditableProjectTitle from "./EditableProjectTitle";

interface ServerProjectPageProps {
  projectId: number;
}


export default async function ServerProjectPage({ projectId }: ServerProjectPageProps) {
  const project = await getProjectById(projectId); 

  if (!project) return <p>Project not found</p>; 
  return (
    <div className="w-full h-screen pt-25 bg-zinc-800 flex justify-center">
      <div className="w-full bg-[#171717] rounded-lg border-zinc-700 border-1 m-10 p-5">
        <EditableProjectTitle projectId={projectId} title={project.title}/>
        <p>
          Due Date: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}
        </p>
        <p>{project.description}</p>
        {project.steps.map((step) => {
          return (
            <div key={step.id}>
              <p key={step.id}>{step.title}</p>
              <p>{step.completed ? "true" : "false"}</p>
            </div>
            
          )
        })}
      </div>
      
    </div>
  );
}
