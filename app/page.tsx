"use client"

import NavBar from "@/components/NavBar";
import ProjectsDashboard, { Project } from "@/components/ProjectsDashboard";
import { addProject, fetchProjects } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function Home() {
  const {token, user} = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const loadProjects = async () => {
    if (!token) return;
    const data = await fetchProjects(token);
    setProjects(data);
  };
  
  useEffect(() => {
    loadProjects();
  }, [token]);

  if (!user) return null;

  return (
    <>
    <NavBar/>
    <main className="bg-zinc-800 w-full h-full">
      <div className="px-15 py-5 flex flex-row justify-between">
        <h1 className="text-white text-5xl font-bold">
          Hello, {user.name}!
        </h1>
        <button className="bg-primary font-bold text-black px-3 rounded-2xl hover:bg-transparent hover:border-2
        hover:text-primary hover:border-primary hover:cursor-pointer" 
        onClick={()=> setShowModal(true)}>
          Add Projects
        </button>
      </div>
      <ProjectsDashboard projects={projects}/>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
              <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!token) {
                    alert("You must be logged in to add a project.");
                    return;}
                  const title = (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value;

                  const form = e.currentTarget
                  
                  const description = (e.currentTarget.elements.namedItem("description") as HTMLInputElement).value;
                  const dueDateInput = (e.currentTarget.elements.namedItem("dueDate") as HTMLInputElement).value;
                  await addProject(token, title, description, dueDateInput || undefined);
                  setShowModal(false);
                  form.reset();
                  await loadProjects();
                }}
              >
                <input
                  name="title"
                  placeholder="Project title"
                  className="w-full p-2 mb-3 rounded bg-zinc-800 text-white border border-zinc-600 focus:border-orange-500"
                  required
                />
                <input
                  name="dueDate"
                  type="date"
                  className="w-full p-2 mb-3 rounded bg-zinc-800 text-white border border-zinc-600"
                />

                <textarea
                  name="description"
                  placeholder="Project description"
                  className="w-full p-2 mb-4 rounded bg-zinc-800 text-white border border-zinc-600 focus:border-primary"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-primary hover:bg-orange-600 text-white"
                  >
                    Add Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </main>
    </>
  )
}
