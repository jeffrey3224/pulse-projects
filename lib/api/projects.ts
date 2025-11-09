import { Project } from "@/components/ProjectsDashboard";


export async function fetchProjects(token: string): Promise<Project[]> {
  const res = await fetch("/api/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch projects");

  return res.json();
}

export async function addProject(
  token: string | null,
  title: string,
  description?: string,
  dueDate?: string
) {
  try {
    if (!token) {
      console.error("No token provided to addProject()");
      throw new Error("Unauthorized — missing token");
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, dueDate }),
    });

    if (!res.ok) {
      const errorText = await res.text(); // get error message from API
      console.error("Failed to add project:", res.status, errorText);
      throw new Error(`Failed to add project: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Project added:", data);
    return data;
  } catch (err) {
    console.error("Error in addProject:", err);
    throw err;
  }
}

export async function fetchSteps(token: string, projectId: number) {
  const res = await fetch(`/api/projects/${projectId}/steps`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch steps");
  return res.json();
}

export async function fetchTasks(token: string, stepId: number, projectId: number) {
  const url = `/api/projects/${projectId}/steps/${stepId}/tasks`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ fetchTasks(${stepId}) failed [${res.status}]:`, text);
      throw new Error(`Failed to fetch tasks (${res.status})`);
    }

    return res.json();
  } catch (err) {
    console.error(`🔥 fetchTasks error for step ${stepId}:`, err);
    throw err;
  }
}




