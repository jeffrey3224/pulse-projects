"use client"

import NavBar from "@/components/NavBar";
import { useProjectStore } from "@/lib/store/projectStore";
import { useParams } from "next/navigation";

export default function ProjectPage() {

  const {projects} = useProjectStore();
  const params = useParams();

  const projectId = Number(params.projectId);

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <>
        <NavBar />
        <div className="p-6">
          <h1 className="text-xl">
            Project not found.
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <h1>{project.title} </h1>
    </>
  )
}