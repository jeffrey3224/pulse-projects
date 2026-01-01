
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

  const completedSteps = project.steps.filter(s => s.completed).length;
  const totalSteps = project.steps.length;

  return (
    <div className="w-full min-h-screen pt-24 bg-zinc-800 flex justify-center">
      <div className="w-[70vw] max-w-[750px] min-w-[400px] space-y-4 m-10">

        {/* HEADER */}
        <div className="bg-[#171717] rounded-2xl border border-zinc-700 p-5 shadow-2xl">
          <div className="flex justify-between items-start">

            <EditableProjectTitle projectId={projectId} title={project.title} />

            {completedSteps === totalSteps && totalSteps > 0 ? (
              <FaCheckCircle className="text-green-500 mt-2" size={25} />
            ) : (
              <AiFillExclamationCircle className="text-yellow-400 mt-2" size={25} />
            )}
          </div>

          <DueDateInput id={project.id} dueDate={project.dueDate} />

          {/* DESCRIPTION */}

          {project.description && (
          <div className="bg-[#171717] rounded-xl border border-zinc-700 p-5">
            <p className="text-zinc-300">{project.description}</p>
          </div>
        )}

        </div>

        {/* STEPS */}
        <div className="bg-[#171717] rounded-2xl border border-zinc-700 p-5 flex flex-col max-h-[400px]">
          <h2 className="text-xl font-semibold mb-3">Steps</h2>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {project.steps
              .sort((a, b) => a.id - b.id)
              .map((step) => (
                <div
                  key={step.id}
                  className="flex justify-between items-center border-b border-zinc-700 py-2"
                >
                  <p>{step.title}</p>

                  {step.completed ? (
                    <FaCheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AiFillExclamationCircle className="text-yellow-400" size={20} />
                  )}
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}

