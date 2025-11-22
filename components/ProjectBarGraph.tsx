"use client"

import { useProjectStore } from "@/lib/store/projectStore"
import { Project } from "@/lib/types/projects";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = { height: number; width: number; }

export default function ProjectsBarGraph({height, width}: Props) {
  const projects = useProjectStore((state) => state.projects);

  const data = useMemo(() => {
    if (!projects || !projects.length) return [];

    const startDate = new Date(
      Math.min(...projects.map(p => new Date(p.createdAt).getTime()))
    );
    const endDate = new Date();

    const dates: string[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }

    return dates.map(date => {
      const completed = projects.filter(p => p.completedAt && p.completedAt.slice(0, 10) === date).length;
      const total = projects.filter(p => new Date(p.createdAt).toISOString().slice(0, 10) === date).length;
      return { date, completed, notCompleted: total - completed };
    });

  }, [projects]);

  return (
    <div className="w-full h-[350px] bg-dark-gray rounded-2xl border-2 border-zinc-700 p-5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 40, right: 20, top: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="7 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" name="Completed" fill="#FF9400" />
          <Bar dataKey="notCompleted" name="Not Completed" fill="#787276" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
