

export async function fetchProjects(token: string) {
  const res = await fetch("/api/projects", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch projects")
  }

  return res.json();
}