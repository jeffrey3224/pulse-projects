"use client"

import NavBar from "@/components/NavBar";
import ProjectsDashboard from "@/components/ProjectsDashboard";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function Home() {
  const {user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
    <NavBar/>
    <main className="bg-zinc-800 w-full h-full">
      <h1 className="text-white text-5xl font-bold">Hello, {user.name}!</h1>
      <ProjectsDashboard/>
    </main>
    </>
  )
}
