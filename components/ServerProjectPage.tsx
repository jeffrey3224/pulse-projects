
import { getProjectById } from "@/lib/db/projects";
import DueDateInput from "./DueDateInput";
import ClientProjectSteps from "./ClientProjectSteps";
import ProjectStatus from "./ProjectStatus";
import AddStepsButton from "./AddStepsButton";
import EditableProjectDescription from "./EditableDescription";
import EditableProjectTitle from "./EditableProjectTitle";

interface ServerProjectPageProps {
  projectId: number;
}

export default async function ServerProjectPage({ projectId }: ServerProjectPageProps) {
  const project = await getProjectById(projectId); 
  if (!project) return <p>Project not found</p>; 

  const completedSteps = project.steps.filter(s => s.completed).length;
  const totalSteps = project.steps.length;

  const projectComplete: boolean = completedSteps === totalSteps && totalSteps > 0;

  return (
    <div className="w-full min-h-screen pt-24 bg-zinc-800 flex justify-center px-7 lg:px-0">
      <div className="w-full lg:w-[80vw] lg:max-w-[1000px] min-w-[400px] space-y-4 my-10">

        {/* HEADER */}
        <div className="bg-[#171717] rounded-2xl border border-zinc-700 p-5 shadow-2xl">
          <div className="flex justify-between items-start">

            <EditableProjectTitle projectId={projectId} title={project.title} />
            <ProjectStatus initialStatus={projectComplete} projectId={project.id}/>

          </div>

          <DueDateInput id={project.id} dueDate={project.dueDate} />

          {/* DESCRIPTION */}
          {project.description && 
            <EditableProjectDescription projectId={project.id} description={project.description}/>
        }

        </div>

        {/* STEPS */}
        <div className="bg-[#171717] rounded-2xl border border-zinc-700 p-5 flex flex-col">
          <div className="flex flex-row justify-start items-center mb-3 space-x-3">
            <h2 className="text-2xl font-semibold">Steps</h2>
            <AddStepsButton projectId={project.id}/>
          </div>
          

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <ClientProjectSteps projectId={project.id} />
          </div>
        </div>

      </div>
    </div>
  );
}

