

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

