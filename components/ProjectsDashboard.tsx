import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";

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

export default function ProjectsDashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [steps, setSteps] = useState<Record<number, Step[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects and return the array
  async function fetchProjects(): Promise<Project[]> {
    const res = await fetch("/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  }

  // Fetch steps for a single project
  async function fetchSteps(projectId: number): Promise<Step[]> {
    const res = await fetch(`/api/projects/${projectId}/steps`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch steps for project ${projectId}`);
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

        // 2️⃣ Fetch steps for each project
        const stepsMap: Record<number, Step[]> = {};
        await Promise.all(
          projectsData.map(async (project) => {
            const projectSteps = await fetchSteps(project.id);
            stepsMap[project.id] = projectSteps;
          })
        );
        setSteps(stepsMap);
      } catch (err) {
        console.error(err);
        setError("Error loading projects or steps");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [token]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap justify-start items-start gap-5 p-7 w-fit">
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-[30vw] p-5 rounded-2xl bg-[#171717] border-1 border-zinc-700"
          >
            <p className="text-2xl font-bold">{project.title}</p>
            <p className="text-md font-base">{project.description}</p>
            <p>Due: {project.dueDate}</p>
            <div>
              {steps[project.id]?.map((step) => (
                <p key={step.id}>{step.title}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
