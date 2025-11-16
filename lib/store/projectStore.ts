import { create } from "zustand";
import { Project, Step } from "@/lib/types/projects";
import { updateStepStatus } from "../api/steps";

export interface ProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;

  updateStepTitle: (projectId: number, stepId: number, newTitle: string) => void;
  toggleStepCompletion: (token: string, projectId: number, stepId: number, stepsMenu: boolean) => void;

  openDeleteStepModal: (stepId: number) => void;
  closeDeleteStepModal: () => void;

  deleteStep: (token: string, projectId: number, stepId: number) => void;

  deletingStepId: number | null;

  renamingProjectId: number | null;
  renamingStepId: number | null;
  renamingStepName: string | null;

  activeStep: number | null;
  setActiveStep: (stepId: number | null) => void;

  openRenameModal: (projectId: number, stepId: number, stepName: string) => void;
  closeRenameModal: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],

  setProjects: (projects) => set({ projects }),

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

    toggleStepCompletion: async (token, projectId, stepId, stepsMenu) => {
      if (!token) return;
    
      let updatedStatus: boolean | undefined;
    
      set((state) => ({
        projects: state.projects.map((project) => {
          if (project.id !== projectId) return project;
    
          return {
            ...project,
            steps: project.steps?.map((step) => {
              if (step.id !== stepId) return step;
              updatedStatus = !step.completed; 

              return { ...step, completed: updatedStatus };
            }),
          };
        }),
        activeStep: stepsMenu ? null : state.activeStep,
      }));
    
      if (updatedStatus !== undefined) {
        try {
          await updateStepStatus(token, projectId, stepId, updatedStatus);
        } catch (err) {
          console.error("Failed to update step status", err);
          // Optional: rollback UI change here if needed
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
    
  renamingProjectId: null,
  renamingStepId: null,
  renamingStepName: null,
  deletingStepId: null,

  openRenameModal: (projectId, stepId, stepName) =>
    set({
      renamingProjectId: projectId,
      renamingStepId: stepId,
      renamingStepName: stepName,
    }),

  closeRenameModal: () =>
    set({
      renamingProjectId: null,
      renamingStepId: null,
      renamingStepName: null,
    }),

  openDeleteStepModal: (stepId) => set({
      deletingStepId: stepId,
  }),

  closeDeleteStepModal: () => set({
      deletingStepId: null
  }),
}));
