import DeleteStepModal from "@/components/Modals/DeleteStepModal";
import RenameStepModal from "@/components/Modals/RenameStepModal";
import NavBar from "@/components/NavBar";
import ServerProjectPage from "@/components/ServerProjectPage";
import { useProjectStore } from "@/lib/store/projectStore";

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
