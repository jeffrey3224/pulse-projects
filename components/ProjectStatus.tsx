"use client";

import { useProjectStore } from "@/lib/store/projectStore";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

type Props = {
  initialStatus: boolean;
  projectId: number;
};

export default function ProjectStatus({ initialStatus, projectId }: Props) {
  const { projects, optimisticStepAdd, openDeleteProjectModal } = useProjectStore();

  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const allStepsComplete =
  project.steps?.length > 0 &&
  project.steps.every(step => step.completed);

  const completed = allStepsComplete && !optimisticStepAdd;

  const handleDeleteProject = (projectId: number) => {
    openDeleteProjectModal(projectId)
  }

  return (
    <div className="flex flex-row space-x-7 justify-center items-center mt-2">
      <div>
        {completed ? (
            <FaCheckCircle className="text-green-500" size={25} />
          ) : (
            <AiFillExclamationCircle className="text-yellow-400 mt-2" size={25} />
          )}
      </div>
      <button onClick={() => handleDeleteProject(projectId)}>
        <FaTrash size={22} className="text-zinc-500 hover:text-primary mr-2 cursor-pointer"/>
      </button>
    </div>
  )
}
