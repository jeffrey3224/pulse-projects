import NavBar from "@/components/NavBar";
import ServerProjectPage from "@/components/ServerProjectPage";

interface PageProps {
  params: { projectId: string };
}

export default async function ProjectPage({ params }: PageProps) {
  // Ensure params.projectId is accessed properly
  const projectId = Number(params.projectId); 
  if (isNaN(projectId)) return <p>Invalid project ID</p>;

  return (
    <>
      <NavBar /> {/* client component */}
      <ServerProjectPage projectId={projectId} />
    </>
  );
}
