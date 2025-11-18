"use client";

import AddProjectModal from "@/components/Modals/AddProjectModal";
import RenameStepModal from "@/components/Modals/RenameStepModal";
import NavBar from "@/components/NavBar";
import ProjectsDashboard from "@/components/ProjectsDashboard";
import { fetchProjects } from "@/lib/api/projects";
import { fetchSteps } from "@/lib/api/steps";
import { useAuth } from "@/lib/AuthContext";
import { useProjectStore } from "@/lib/store/projectStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Project } from "@/lib/types/projects";
import DeleteStepModal from "@/components/Modals/DeleteStepModal";
import ProjectsBarGraph from "@/components/ProjectBarGraph";
import ProjectLineGraph from "@/components/ProjectLineGraph";


export default function Home() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [showAddProjectsModal, setShowAddProjectsModal] = useState(false);

  const {
    projects,
    setProjects,
    renamingProjectId,
    renamingStepId,
    renamingStepName,
    deletingStepId,
    deletingStepProjectId,
    closeDeleteStepModal,
    openRenameModal,
    closeRenameModal,
    updateStepTitle,
  } = useProjectStore();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const loadProjects = async () => {
    if (!token) return;
  
    const projectsData = await fetchProjects(token);

    const projectsWithSteps: Project[] = await Promise.all(
      projectsData.map(async (project) => {
        const steps = await fetchSteps(token, project.id);
        return { ...project, steps }; // attach steps directly to the project
      })
    );
  
    // Update Zustand store
    setProjects(projectsWithSteps);
  };

  const handleRenameSuccess = (newTitle: string) => {
    if (
      renamingProjectId === null ||
      renamingStepId === null
    ) return;

    updateStepTitle(renamingProjectId, renamingStepId, newTitle);
    closeRenameModal();
  };

  if (!user) return null;

  return (
    <>
      <NavBar />
      <main className="bg-zinc-800 w-full h-full">
        <div className="px-15 py-5 flex flex-row justify-between">
          <h1 className="text-white text-5xl font-bold">
            Hello, {user.name}!
          </h1>
          <button
            className="bg-primary font-bold text-black px-3 rounded-2xl hover:bg-transparent hover:border-2
            hover:text-primary hover:border-primary hover:cursor-pointer"
            onClick={() => setShowAddProjectsModal(true)}
          >
            Add Project
          </button>
        </div>

        <div className="px-15">
          <div className="grid grid-cols-2 gap-5 min-w-[200px] pb-10">
            <ProjectsBarGraph height={300} width={900}/>
            <ProjectLineGraph />
          </div>
          
          <ProjectsDashboard />
        </div>
        

        <AddProjectModal
          isOpen={showAddProjectsModal}
          onClose={() => setShowAddProjectsModal(false)}
          onAdded={loadProjects}
        />

        <RenameStepModal
          projectId={renamingProjectId}
          stepId={renamingStepId}
          stepName={renamingStepName}
          isOpen={renamingStepId !== null}
          onClose={closeRenameModal}
          onSuccess={handleRenameSuccess}
        />

        <DeleteStepModal
        isOpen={deletingStepId !== null}
        projectId={deletingStepProjectId}
        stepId={deletingStepId}
        onClose={closeDeleteStepModal}
        />
      </main>
    </>
  );
}
