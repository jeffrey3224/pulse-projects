
import { getProjectById } from "@/lib/db/projects";

interface ServerProjectPageProps {
  projectId: number;
}


export default async function ServerProjectPage({ projectId }: ServerProjectPageProps) {
  const project = await getProjectById(projectId); 

  if (!project) return <p>Project not found</p>; 
  return (
    <div className="mt-25">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>
        Due Date: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}
      </p>
    </div>
  );
}
