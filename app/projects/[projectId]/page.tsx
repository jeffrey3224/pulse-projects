import NavBar from "@/components/NavBar";
import ServerProjectPage from "@/components/ServerProjectPage";

interface PageProps {
  params: { projectId: string };
}

export default async function ProjectPage({ params }: PageProps) {

  const projectId = Number(params.projectId); 
  if (isNaN(projectId)) return <p>Invalid project ID</p>;

  return (
    <>
      <NavBar /> 
      <ServerProjectPage projectId={projectId} />
    </>
  );
}
