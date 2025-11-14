import { fetchSteps, fetchTasks } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { GridLoader } from "react-spinners";
import { BsThreeDots } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillExclamationCircle } from "react-icons/ai";
import ProjectMenu from "./ProjectMenu";
import { renameStep, updateStepStatus } from "@/lib/api/steps";

export type Project = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
};

type Props = {
  projects: Project[];
  onRenameStepClick: (stepId: number, stepName: string, projectId: number) => void;
}

type Step = {
  id: number;
  title: string;
  completed: boolean;
};

type Task = {
  id: number;
  title: string;
  completed: boolean;
}

export default function ProjectsDashboard({ projects, onRenameStepClick }: Props) {
  const { token } = useAuth();
  const [steps, setSteps] = useState<Record<number, Step[]>>({});
  const [tasks, setTasks] = useState<Record<number, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectMenu, setProjectMenu] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStepsAndTasks() {
      if (!token) return;
  
      try {
        setLoading(true);
  
        const stepsMap: Record<number, Step[]> = {};
        const tasksMap: Record<number, Task[]> = {};
  
        await Promise.all(
          projects.map(async (project) => {
            try {
              // Fetch steps for this project
              const projectSteps = await fetchSteps(token, project.id);
              stepsMap[project.id] = projectSteps;
  
              // Fetch tasks for each step (safe individually)
              await Promise.all(
                projectSteps.map(async (step: Step) => {
                  try {
                    const stepTasks = await fetchTasks(token, step.id, project.id);
                    tasksMap[step.id] = stepTasks;
                  } catch (err) {
                    console.error(`Failed to fetch tasks for step ${step.id}:`, err);
                    tasksMap[step.id] = []; // Fallback to an empty array
                  }
                })
              );
            } catch (err) {
              console.error(`Failed to fetch steps for project ${project.id}:`, err);
              stepsMap[project.id] = []; // Fallback to empty steps list
            }
          })
        );
  
        setSteps(stepsMap);
        setTasks(tasksMap);
      } catch (err) {
        console.error("💥 Unexpected error fetching data:", err);
        setError("Error loading steps or tasks");
      } finally {
        setLoading(false);
      }
    }
  
    if (projects.length) {
      fetchStepsAndTasks();
    }
  }, [projects, token]);
  

  const handleMenu = (id: number) => {
      setProjectMenu(prev => ({
        ...prev, 
        [id]: !prev[id],
      }))
  }

  const handleCloseMenu = (id: number) => {
    setProjectMenu(prev => ({
      ...prev,
      [id]: false,
    }))
  }

  const handleStepMenu = (id: number) => {
    setActiveStep(prev => (prev === id ? null : id));
    
  }

  const handleToggleStepCompletion = async (projectId: number, stepId: number, currentStatus: boolean) => {
    if (!token) return;
  
    try {
      // Update backend
      await updateStepStatus(token, projectId, stepId, !currentStatus);
  
      // Update frontend immediately
      setSteps(prevSteps => {
        const updatedSteps = { ...prevSteps };
        updatedSteps[projectId] = updatedSteps[projectId].map(step =>
          step.id === stepId ? { ...step, completed: !currentStatus } : step
        );
        return updatedSteps;
      });
      handleStepMenu(stepId);
    } catch (err) {
      console.error("Failed to update step status:", err);
    }
  };
  
  if (loading) return (
    <div className="w-full flex flex-col justify-center items-center">
    <GridLoader
        color={"#FF9400"}
        size={100}
        speedMultiplier={.7}
        aria-label="Loading Spinner"
        data-testid="loader"
        
      />
      <p className="text-xl py-10">Loading projects...</p>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  if (projects.length === 0) return <p className="text-xl">Start by creating a new project!</p>

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-7 w-full">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-[#171717] border-1 border-zinc-700 min-w-[325px] relative"
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-2xl font-bold">{project.title}</p>
                <button onClick={() => handleMenu(project.id)}>
                  <div className="bg-dark-gray hover:bg-zinc-800 h-8 w-8 flex items-center justify-center rounded-[16px]">
                  <BsThreeDots size={20}/>
                  </div>
                </button>
            </div>
           
           {project.dueDate && <p className="text-right mb-3">Due: {project.dueDate}</p>}

            <p className="text-md font-base">{project.description}</p>
            
            {steps[project.id]?.length > 0 && (
                <div className="w-full bg-zinc-800 rounded-lg px-2 mt-2">
                  {steps[project.id]?.map((step) => (
                    <div className="flex flex-col justify-between relative border-b-[1px] border-zinc-500 last:border-none py-2" key={step.id}>
                      <div className="flex items-center justify-between">
                        <p>{step.title}</p>
                        {step.completed ? (
                          <button onClick={() => handleStepMenu(step.id)}>
                            <FaCheckCircle color="green" size={20} />
                          </button>
                        ) : (
                          <button onClick={() => handleStepMenu(step.id)}>
                             <AiFillExclamationCircle color="#ede882" size={20} />
                          </button>
                        )}
                      </div>

                      {/* Step Menu */}
                      {activeStep === step.id && 

                        (
                          <div className="bg-dark-gray border-1 border-zinc-700 rounded-lg w-40 absolute top-10 right-0 z-10 shadow-2xl">
                            <div className="flex flex-col">
                              <div className="border-t border-zinc-700 hover:bg-zinc-800">
                                <button className="text-left py-1 px-2 w-full h-full"
                                onClick={() => onRenameStepClick(step.id, step.title, project.id)}>
                                  Rename
                                </button>
                              </div>
                              
                              {step.completed ?
                              <div className="border-t border-zinc-700 hover:bg-zinc-800">
                                <button className="text-left py-1 px-2" onClick={() => handleToggleStepCompletion(project.id, step.id, step.completed)}>
                                  Mark Incomplete
                                </button>
                              </div>
                              : 
                              <div className="border-t border-zinc-700 hover:bg-zinc-800">
                                <button className="text-left py-1 px-2" onClick={() => handleToggleStepCompletion(project.id, step.id, step.completed)}>
                                  Mark Complete
                                </button>
                              </div>
                              }
                              <div className="border-t border-zinc-700 hover:bg-zinc-800">
                                <button className="text-left py-1 px-2">
                                  Delete Step
                                </button>
                              </div>
                            </div>
                          </div> 
                        )
                      }
                    </div>
                  ))}
                </div>
              )}

            {// edit menu is absolute
              projectMenu[project.id] && <ProjectMenu id={project.id}/>
            }
            
          </div>
        ))}
      </div>
    </div>
  );
}
