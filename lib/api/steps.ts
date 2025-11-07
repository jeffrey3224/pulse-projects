export async function fetchSteps(token: string) {
  const res = await fetch("/api/steps", {
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