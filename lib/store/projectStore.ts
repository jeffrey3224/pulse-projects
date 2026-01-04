import { create } from "zustand";
import { Project, Step } from "@/lib/types/projects";
import { updateStepStatus } from "../api/steps";

export interface ProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  loadProjects: (token: string) => void;
  updateStepTitle: (projectId: number, stepId: number, newTitle: string) => void;
  toggleStepCompletion: (token: string, projectId: number, stepId: number, stepsMenu: boolean) => void;
  openDeleteStepModal: (stepId: number, projectId: number) => void;
  closeDeleteStepModal: () => void;
  closeAddStepModal: () => void;
  setAddStepName: (stepName: string) => void;
  addStepName: string | null;
  activeProjectAddingStep: number | null;
  deleteStep: (token: string, projectId: number, stepId: number) => void;
  deletingStepId: number | null;
  renamingStepProjectId: number | null;
  renamingStepId: number | null;
  renamingStepName: string | null;
  deletingStepProjectId: number | null;
  renamingProjectName: string | null;
  renamingProjectId: number | null;
  activeStep: number | null;
  activeProject: number | null;
  setActiveStep: (stepId: number | null) => void;
  setActiveProject: (projectId: number | null) => void;
  setAddingStepActiveProject: (projectId: number | null) => void;
  openRenameStepModal: (projectId: number, stepId: number, stepName: string) => void;
  closeRenameStepModal: () => void;
  showAnalytics: boolean; 
  setShowAnalytics: () => void;
  openRenameProjectModal: (projectId: number, projectName: string) => void;
  closeRenameProjectModal: () => void;
  setOptimisticStepAdd: (value: boolean) => void;
  optimisticStepAdd: boolean;
  completeProject: (token: string, projectId: number) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],

  loadProjects: async (token: string) => {
    if (!token) return;
  
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) {
        console.error("Failed to load projects");
        return;
      }
  
      const data = await res.json();
  
      set({ projects: data });
    } catch (err) {
      console.error("Error loading projects", err);
    }
  },
  
  setProjects: (projects) => set({ projects }),

  setAddStepName: (stepName: string) => set({addStepName: stepName}),

  updateStepTitle: (projectId, stepId, newTitle) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id !== projectId
          ? project
          : {
              ...project,
              steps: project.steps?.map((step) =>
                step.id === stepId ? { ...step, title: newTitle } : step
              ),
            }
      ),
    })),

    activeStep: null,
    setActiveStep: (stepId) => set({ activeStep: stepId }),

    activeProject: null,
    setActiveProject: (projectId) => set({ activeProject: projectId }),

  activeProjectAddingStep: null,
  setAddingStepActiveProject: (projectId) => set({ activeProjectAddingStep: projectId }),

  toggleStepCompletion: async (token, projectId, stepId, stepsMenu) => {
    
    if (!token) return;
  
    let updatedStatus: boolean | undefined;
  
    set((state) => {
      return {
        projects: state.projects.map((project) => {
          if (project.id !== projectId) return project;
  
          const updatedSteps = project.steps?.map((step) => {
            if (step.id !== stepId) return step;
  
            updatedStatus = !step.completed;
            return { ...step, completed: updatedStatus };
          }) ?? [];
  
          const allStepsComplete =
            updatedSteps.length > 0 &&
            updatedSteps.every((step) => step.completed);
  
          return {
            ...project,
            steps: updatedSteps,
            completed: allStepsComplete,
          };
        }),
  
        activeStep: stepsMenu ? null : state.activeStep,
      };
    });
  
    if (updatedStatus !== undefined) {
      try {
        await updateStepStatus(token, projectId, stepId, updatedStatus);
      } catch (err) {
        console.error("Failed to update step status", err);
        // Optional rollback here
      }
    }
  },
  

  deleteStep: async (token, projectId, stepId) => {
    if (!token) return;
    try {
      await fetch(`/api/projects/${projectId}/steps/${stepId}`, {
        method: "DELETE"  ,
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        projects: state.projects.map((project) => project.id !== projectId ? project : {
          ...project, steps: project.steps?.filter((s) => s.id !== stepId),
        }
      ),
      activeStep: null,
      }));
    } catch (err) {
    console.error(err);}
  },
    
  renamingStepProjectId: null,
  renamingStepId: null,
  renamingStepName: null,
  deletingStepId: null,
  deletingStepProjectId: null,
  renamingProjectId: null,
  renamingProjectName: null,
  showAnalytics: true,
  allStepsComplete: false,
  addStepName: null,
  optimisticStepAdd: false,

  setOptimisticStepAdd: (value: boolean) => set({ optimisticStepAdd: value}),

  setShowAnalytics: () =>
    set((state) => ({ showAnalytics: !state.showAnalytics })),  

  openRenameStepModal: (projectId, stepId, stepName) =>
    set({
      renamingStepProjectId: projectId,
      renamingStepId: stepId,
      renamingStepName: stepName,
    }),

  closeRenameStepModal: () =>
    set({
      renamingStepProjectId: null,
      renamingStepId: null,
      renamingStepName: null,
    }),

  closeAddStepModal: () => 
    set({
      activeProject: null
    }),

  openDeleteStepModal: (stepId, projectId) => set({
      deletingStepId: stepId,
      deletingStepProjectId: projectId
  }),

  closeDeleteStepModal: () => set({
      deletingStepId: null
  }),

  openRenameProjectModal: (projectId, projectName) => 
    set({
      renamingProjectId: projectId,
      renamingProjectName: projectName,
    }),

  closeRenameProjectModal: () => 
    set({
      renamingProjectId: null,
      renamingProjectName: null,
    }),

  completeProject: async (token: string, projectId: number) => {
    if (!token) return;

    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
  
      set((state) => ({
        projects: state.projects.map(p =>
          p.id === projectId ? { ...p, completedAt: new Date().toISOString() } : p
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },

}));
