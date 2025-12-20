"use client";

import { useAuth } from "@/lib/AuthContext";
import { useProjectStore } from "@/lib/store/projectStore";
import { GridLoader } from "react-spinners";
import { BsThreeDots } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillExclamationCircle } from "react-icons/ai";
import ProjectMenu from "./ProjectMenu";
import { useEffect, useState } from "react";
import { fetchSteps } from "@/lib/api/steps";
import { fetchProjects } from "@/lib/api/projects";
import Link from "next/link";
import ProjectsBarGraph from "./ProjectBarGraph";
import ProjectLineGraph from "./ProjectLineGraph";
import { Project } from "@/lib/types/projects";

export default function ProjectsDashboard() {
  const { token } = useAuth();
  const {
    openRenameStepModal,
    toggleStepCompletion,
    activeStep,
    setActiveStep,
    activeProject,
    setActiveProject,
    openDeleteStepModal,
  } = useProjectStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { projects, setProjects } = useProjectStore();
  const [sorting, setSorting] = useState<string>("oldest");

  useEffect(() => {
    async function fetchProjectsData() {

      if (!token) return;

      setLoading(true);
      try {
        const projectsData = await fetchProjects(token);
        const projectsWithSteps = await Promise.all(
          projectsData.map(async (project) => {
            const steps = await fetchSteps(token, project.id);
            return { ...project, steps };
          })
        );
        setProjects(projectsWithSteps);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
        console.log(projects.map(p => ({ id: p.id, steps: p.steps })));

      }
    }
  
    fetchProjectsData();
  }, [token, setProjects]);

  if (loading)
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <GridLoader color="#FF9400" size={80} speedMultiplier={0.7} />
        <p className="text-xl py-10">Loading projects...</p>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;
  if (!projects.length) return <p className="text-xl text-center pb-10">Start by creating a new project!</p>;

  const handleMenu = (id: number) => {
    setActiveProject(activeProject === id ? null : id);
  };

  const sortingAlg = (a: Project, b: Project) => {
    if (sorting === "newest") {
      return b.id - a.id;
    }
  
    if (sorting === "oldest") {
      return a.id - b.id;
    }
  
    if (sorting === "due-date") {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return aTime - bTime;
    }
  
    return 0;
  };

  return (
    <>
      {!loading && 
        (
          <div className="flex flex-row gap-5 min-w-[200px] pb-10">
            <ProjectsBarGraph height={300} width={900}/>
            <ProjectLineGraph />

          </div>
        )
      }
    <div className="w-full flex justify-end pb-5">
      <label htmlFor={"sorting-options"}>Sort Projects:</label> 
      <select id="sorting-options" value={sorting} onChange={(e) => setSorting(e.target.value)} className="border-1 border-zinc-700 min-w-[150px] ml-5">
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="due-date">Due Date</option>
      </select> 
    </div>

    <div className="flex justify-center pb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {projects.sort((a,b) => sortingAlg(a,b)).map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-[#171717] border-1 border-zinc-700 min-w-[325px] relative">
            <div className="flex justify-between items-start mb-1">
              <Link href={`/projects/${project.id}`}>
                 <p className="text-2xl font-bold">{project.title}</p>
              </Link>
              <button onClick={() => handleMenu(project.id)}>
                <div className="bg-dark-gray hover:bg-zinc-800 h-8 w-8 flex items-center justify-center rounded-[16px]">
                  <BsThreeDots size={20} />
                </div>
              </button>
            </div>

            {project.dueDate && <p className="text-left mb-3">Due: {project.dueDate}</p>}
            <p className="text-md font-base">{project.description}</p>

            {project.steps?.length > 0 && (
              <div className="w-full bg-zinc-800 rounded-lg px-2 mt-2">
                {project.steps.map((step) => (
                  <div
                    className="flex flex-col justify-between relative border-b-[1px] border-zinc-600 last:border-none py-2"
                    key={step.id}
                  >
                    <div className="flex items-center justify-between">
                      <p>{step.title}</p>
                      <button onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}>
                        {step.completed ? <FaCheckCircle color="green" size={20} /> : <AiFillExclamationCircle color="#ede882" size={20} />}
                      </button>
                    </div>

                    {activeStep === step.id && (
                      <div className="bg-dark-gray border-1 border-zinc-700 rounded-lg w-40 absolute top-10 right-0 z-20 shadow-2xl">
                        <div className="flex flex-col">
                          <div className="border-t border-zinc-700 hover:bg-zinc-800">
                            <button
                              className="text-left py-1 px-2 w-full h-full"
                              onClick={() =>
                                openRenameStepModal(project.id, step.id, step.title)
                              }
                            >
                              Rename
                            </button>
                          </div>

                          <div className="border-t border-zinc-700 hover:bg-zinc-800">
                            <button
                              className="text-left py-1 px-2"
                              onClick={() => toggleStepCompletion(token!, project.id, step.id, true)}
                            >
                              {step.completed ? "Mark Incomplete" : "Mark Complete"}
                            </button>
                          </div>

                          <div className="border-t border-zinc-700 hover:bg-zinc-800">
                            <button className="text-left py-1 px-2"
                            onClick={() => openDeleteStepModal(step.id, project.id)}>Delete Step</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
              </div>
            )}

            {activeProject == project.id && <ProjectMenu id={project.id} name={project.title} />}
            
          </div>
          
        ))}
      </div>
    </div>
    </>
  );
}
