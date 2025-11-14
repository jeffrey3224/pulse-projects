"use client"

import AddProjectModal from "@/components/Modals/AddProjectModal";
import RenameStepModal from "@/components/Modals/RenameStepModal";
import NavBar from "@/components/NavBar";
import ProjectsDashboard, { Project } from "@/components/ProjectsDashboard";
import { fetchProjects } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function Home() {
  const {token, user} = useAuth();
  const router = useRouter();
  const [showAddProjectsModal, setShowAddProjectsModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [renamingStepId, setRenamingStepId] = useState<number | null>(null);
  const [renamingStepName, setRenamingStepName] = useState<string | null>(null);
  const [renamingStepProjectId, setRenamingStepProjectId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const loadProjects = async () => {
    if (!token) return;
    const data = await fetchProjects(token);
    setProjects(data);
  };
  
  useEffect(() => {
    loadProjects();
  }, [token]);

  const openRenameStepModal = (stepId: number, stepName: string, projectId: number) => {
    setRenamingStepId(stepId)
    setRenamingStepName(stepName);
    setRenamingStepProjectId(projectId);
  };
  const closeRenameStepModal = () => {
    setRenamingStepId(null);
  }

  if (!user) return null;

  return (
    <>
    <NavBar/>
    <main className="bg-zinc-800 w-full h-full">
      <div className="px-15 py-5 flex flex-row justify-between">
        <h1 className="text-white text-5xl font-bold">
          Hello, {user.name}!
        </h1>
        <button className="bg-primary font-bold text-black px-3 rounded-2xl hover:bg-transparent hover:border-2
        hover:text-primary hover:border-primary hover:cursor-pointer" 
        onClick={()=> setShowAddProjectsModal(true)}>
          Add Project
        </button>
      </div>
      <ProjectsDashboard projects={projects} onRenameStepClick={openRenameStepModal}/>
        
      <AddProjectModal
        isOpen={showAddProjectsModal}
        onClose={() => setShowAddProjectsModal(false)}
        onAdded={loadProjects}
      />

      <RenameStepModal
      stepId={renamingStepId}
      stepName={renamingStepName}
      projectId={renamingStepProjectId}
      isOpen={renamingStepId !== null}
      onClose={closeRenameStepModal}
      />
     
    </main>
    </>
  )
}
