"use client"

import { fetchProjects, fetchSteps } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useProjectStore } from "@/lib/store/projectStore";
import { Step, Project } from "@/lib/types/projects";
import { useEffect, useState } from "react";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import RenameStepModal from "./Modals/RenameStepModal";
import DeleteStepModal from "./Modals/DeleteStepModal";

type Props = {
  projectId: number
}

export default function ClientProjectSteps({ projectId }: Props) {
  const { token } = useAuth();
  const { openRenameStepModal, toggleStepCompletion, openDeleteStepModal } = useProjectStore();

  const [project, setProject] = useState<Project | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    async function loadProject() {
      // fetch project
      const projectData = await fetchProjects(token!);
      const filteredProject = projectData.filter((p) => p.id === projectId);

      // fetch steps
      const stepsData: Step[] = await fetchSteps(token!, projectId);

      setProject({ ...filteredProject, steps: stepsData });
    }

    loadProject();
  }, [token, projectId]);

  if (!project) return <p>Loading project...</p>;

  const isComplete = project.steps?.length > 0 && project.steps.every(s => s.completed);

  return (
    <>
      {project.steps.length > 0 ? (
        <div className="w-full rounded-lg px-2 mt-2 border-zinc-600 border-[1px]">
          {project.steps.sort((a, b) => a.id - b.id).map((step) => (
            <div
              key={step.id}
              className="flex flex-col justify-between relative border-b-[1px] border-zinc-600 last:border-none py-2"
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
                      className="text-left py-1 px-2 hover:bg-zinc-800"
                      onClick={() => toggleStepCompletion(token!, projectId, step.id, true)}
                    >
                      {step.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button
                      className="text-left py-1 px-2 hover:bg-zinc-800"
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
        projectId={projectId}
        stepId={null}
        stepName=""
        isOpen={false}
        onClose={() => {}}
        onSuccess={() => {}}
      />
      <DeleteStepModal
        projectId={projectId}
        stepId={null}
        isOpen={false}
        onClose={() => {}}
      />
    </>
  );
}
