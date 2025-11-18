"use client"

import { useAuth } from "@/lib/AuthContext";
import { useProjectStore } from "@/lib/store/projectStore"
import { Project } from "@/lib/types/projects";
import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ProjectsBarGraph() {

  const loadProjects = useProjectStore((s) => s.loadProjects);
  const {token} = useAuth();

useEffect(() => {
  if (token) loadProjects(token);
}, [token]);

  const projects = useProjectStore((state) => state.projects);

  function getChartData(projects: Project[]) {
    if (!projects.length) return [];
  
    // Find the earliest creation date
    const startDate = new Date(
      Math.min(...projects.map((p) => new Date(p.createdAt).getTime()))
    );
  
    const endDate = new Date();
  
    const dates: string[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(current.toISOString().slice(0, 10)); 
      current.setDate(current.getDate() + 1);
    }
  
    // Aggregate projects by day
    const chartData = dates.map((date) => {
      const completed = projects.filter(
        (p) => p.completedAt && p.completedAt.slice(0, 10) === date
      ).length;
      const total = projects.filter(
        (p) => new Date(p.createdAt).toISOString().slice(0, 10) === date
      ).length;
      const notCompleted = total - completed;
  
      return { date, completed, notCompleted };
    });
  
    return chartData;

  }

  const data = getChartData(projects);

  return (
    <div className="w-full h-[350px] bg-dark-gray rounded-2xl border-2 border-zinc-700 p-5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{left: -35}}>
          <CartesianGrid strokeDasharray="7 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" name={"Completed"} fill=" #FF9400" />
          <Bar dataKey="notCompleted" name={"Not Completed"} fill="#787276" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}