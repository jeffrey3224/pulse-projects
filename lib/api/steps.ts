export async function fetchSteps(token: string, projectId: number) {
  const res = await fetch(`/api/projects/${projectId}/steps`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch steps")
  }

  return res.json();
}

export async function updateStepStatus(token: string, projectId: number, stepId: number, completed: boolean) {
  const response = await fetch(`api/projects/${projectId}/steps/${stepId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error("Failed to update step status");
  }

  return response.json();
}

export async function renameStep(token: string, projectId: number, stepId: number, title: string) {

  const response = await fetch(`api/projects/${projectId}/steps/${stepId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`, 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: title })
  });

  if (!response.ok) {
    throw new Error("Failed to update step name");
  }

  return response.json();
}


