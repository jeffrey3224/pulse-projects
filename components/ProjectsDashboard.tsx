import { fetchProjects } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";

type Project = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export default function ProjectsDashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProjects() {
  const res = await fetch("/api/projects", {
    headers: {Authorization: `Bearer ${token}`},
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");

  }

  try {
    const data = await res.json();
    setProjects(data);
  }
  
  catch (err) {
    console.error(err);
    setError("Error loading projects");
  }

  finally {
    setLoading(false);
  }
  }

  useEffect(() => {
    fetchProjects();
  }, [token]);

  if (loading) return <p>Loading projects...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="p-7">
      {projects.map((project) => {
        return (
        <div key={project.id} className="w-full h-[80px] bg-[#171717]">
          <p>{project.title}</p>
          <p>{project.description}</p>
          <p>{}</p>
        </div>
          )
      })}
    </div>
  )
}

