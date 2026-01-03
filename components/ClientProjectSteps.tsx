"use client"

import { fetchProjects, fetchSteps } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useProjectStore } from "@/lib/store/projectStore";
import { useEffect, useState } from "react";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import RenameStepModal from "./Modals/RenameStepModal";
import DeleteStepModal from "./Modals/DeleteStepModal";
import AddStepModal from "./Modals/AddStepModal";
import { Step } from "@/lib/types/projects";

type Props = {
  projectId: number
}

export default function ClientProjectSteps({ projectId }: Props) {
  const { token } = useAuth();
  const {
    activeProject,
    activeProjectAddingStep,
    addStepName,
    closeAddStepModal,
    setProjects,
    renamingStepProjectId,
    renamingStepId,
    renamingStepName,
    deletingStepId,
    deletingStepProjectId,
    closeDeleteStepModal,
    closeRenameStepModal,
    updateStepTitle,
    openRenameStepModal,
    toggleStepCompletion,
    openDeleteStepModal,
    renamingProjectId,
  } = useProjectStore();

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [optimisticStep, setOptimisticStep] = useState<Step | null>(null);


  useEffect(() => {
    if (!token) return;
  
    async function load() {
      const projects = await fetchProjects(token!);
      const steps = await fetchSteps(token!, projectId);
  
      const hydratedProjects = projects.map(p =>
        p.id === projectId ? { ...p, steps } : p
      );
  
      setProjects(hydratedProjects);
    }
  
    load();
  }, [token, projectId, setProjects]);

  const project = useProjectStore(
    s => s.projects.find(p => p.id === projectId)
  );
  
  if (!project) return <p>Loading steps...</p>;
  

  const handleRenameSuccess = (newTitle: string) => {
    if (
      renamingProjectId === null ||
      renamingStepId === null
    ) return;

    updateStepTitle(renamingProjectId, renamingStepId, newTitle);
    closeRenameStepModal();
    setActiveStep(null);
  };

  const handleClose = () => {
    setActiveStep(null);
    closeRenameStepModal();
  }

  const handleOptimisticAdd = (title: string) => {
    setOptimisticStep({
      id: 1000.1,
      title,
      completed: false,
    });
  };

  if (!project) return <p>Loading project...</p>;

  const isComplete = project.steps?.length > 0 && project.steps.every(s => s.completed);

  const steps = project.steps ?? [];

  const displaySteps = optimisticStep
  ? [...steps, optimisticStep]
  : steps;


  return (
    <>
      {project.steps.length > 0 ? (
        <div className="w-full rounded-lg px-2 mt-2 border-zinc-600 border-[1px]">
          {displaySteps.sort((a, b) => a.id - b.id).map((step) => (
            <div
              key={step.id}
              className="flex flex-col justify-between relative border-b-[1px] border-zinc-600  last:border-none py-2"
            >
              <div className="flex items-center justify-between">
                <p className={`${isComplete ? "text-zinc-600" : ""}`}>{step.title}</p>
                <button onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}>
                  {step.completed
                    ? <FaCheckCircle color="green" size={20} />
                    : <AiFillExclamationCircle className="text-yellow-400" size={20} />}
                </button>
              </div>

              {activeStep === step.id && (
                <div className="bg-dark-gray border-1 border-zinc-700 rounded-lg w-40 absolute top-2 right-8 z-20 shadow-2xl">
                  <div className="flex flex-col">
                    <button
                      className="text-left py-1 px-2 hover:bg-zinc-800"
                      onClick={() => openRenameStepModal(projectId, step.id, step.title)}
                    >
                      Rename
                    </button>
                    <button
                      className="text-left py-1 px-2 hover:bg-zinc-800 border-t border-zinc-700 hover:bg-zinc-800"
                      onClick={() => toggleStepCompletion(token!, projectId, step.id, true)}
                    >
                      {step.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button
                      className="text-left py-1 px-2 hover:bg-zinc-800 border-t border-zinc-700"
                      onClick={() => openDeleteStepModal(step.id, projectId)}
                    >
                      Delete Step
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No steps found</p>
      )}

      {/* Modals here */}
      <RenameStepModal
        projectId={renamingStepProjectId}
        stepId={renamingStepId}
        stepName={renamingStepName}
        isOpen={renamingStepId !== null}
        onClose={handleClose}
        onSuccess={handleRenameSuccess}
      />
      <DeleteStepModal
        isOpen={deletingStepId !== null}
        projectId={deletingStepProjectId}
        stepId={deletingStepId}
        onClose={closeDeleteStepModal}
        />
      
      <AddStepModal 
        projectId={activeProject}
        isOpen={activeProjectAddingStep !== null}
        onClose={closeAddStepModal}
        onOptimisticAdd={handleOptimisticAdd} 
      />
    </>
  );
}
