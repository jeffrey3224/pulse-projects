"use client"

import { useProjectStore } from "@/lib/store/projectStore";
import { Step } from "@/lib/types/projects";
import { FaCirclePlus } from "react-icons/fa6";

type Props = {
  projectId: number;
}

export default function AddStepsButton({projectId}: Props) {

  const {
    activeProject,
    setActiveProject,
    setAddingStepActiveProject,
    activeProjectAddingStep,
    closeAddStepModal,
  } = useProjectStore();

  const handleButton = () => {
    setActiveProject(projectId)
    setAddingStepActiveProject(projectId);
  }

  return (
    <button onClick={handleButton}>
      <FaCirclePlus size={18} className="hover:cursor-pointer"/>
    </button>
    
  )
}