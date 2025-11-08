import { useAuth } from "@/lib/AuthContext";
import { tasks } from "@/schema/db/schema";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";


type Project = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
};

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

export default function ProjectsDashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [steps, setSteps] = useState<Record<number, Step[]>>({});
  const [tasks, setTasks] = useState<Record<number, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  async function fetchProjects(): Promise<Project[]> {
    const res = await fetch("/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  }

  async function fetchSteps(projectId: number): Promise<Step[]> {
    const res = await fetch(`/api/projects/${projectId}/steps`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch steps for project ${projectId}`);
    return res.json();
  }

  async function fetchTasks(stepId: number, projectId: number): Promise<Task[]> {
    const res = await fetch(`/api/projects/${projectId}/steps/${stepId}/tasks`, {
      headers: { Authorization: `Bearer ${token}`},
    });
    if (!res.ok) throw new Error(`Failed to fetch tasks for project ${projectId}`);
    return res.json();
  }
  


  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        setError(null);
    
        // 1️⃣ Fetch projects
        const projectsData = await fetchProjects();
        setProjects(projectsData);

        const stepsMap: Record<number, Step[]> = {};
        const tasksMap: Record<number, Task[]> = {};
    
        await Promise.all(
          projectsData.map(async (project) => {
            const projectSteps = await fetchSteps(project.id);
            stepsMap[project.id] = projectSteps;

            await Promise.all(
              projectSteps.map(async (step) => {
                const stepTasks = await fetchTasks(step.id, project.id);
                tasksMap[step.id] = stepTasks;
              })
            );
          })
        );
    
        // 5️⃣ Update state
        setSteps(stepsMap);
        setTasks(tasksMap);
    
      } catch (err) {
        console.error(err);
        setError("Error loading projects, steps, or tasks");
      } finally {
        setLoading(false);
      }
    }
    
    fetchAllData();
  }, [token]);

  if (loading) return (
    <div className="w-full flex flex-col justify-center items-center">
    <ClipLoader
        color={"#FF9400"}
        size={150}
        speedMultiplier={.5}
        aria-label="Loading Spinner"
        data-testid="loader"
        
      />
      <p>Loading projects...</p>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap justify-start items-start gap-5 p-7 w-fit">
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-[30vw] p-5 rounded-2xl bg-[#171717] border-1 border-zinc-700 min-w-[325px] max-w-[500px]"
          >
            <p className="text-2xl font-bold">{project.title}</p>
            <p>Due: {project.dueDate}</p>
            <p className="text-md font-base">{project.description}</p>
            
            <div>
              {steps[project.id]?.map((step) => (
                <div className="flex flex-row justify-between" key={step.id}>
                  <p>{step.title}</p>
                  <div>{step.completed ? "Completed" : "In Progress"}
                    <div>
                      {tasks[step.id]?.map((task) => (
                        <div key={task.id}>
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
