"use client"

import { useProjectStore } from "@/lib/store/projectStore";
import { Project } from "@/lib/types/projects";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ProjectLineGraph() {
  const projects = useProjectStore((state) => state.projects);

  const data = useMemo(() => {
    if (!projects || !projects.length) return [];

    const completionDates = projects
      .filter(p => p.completedAt)
      .map(p => new Date(p.completedAt!).toISOString().split("T")[0])
      .sort();

    if (!completionDates.length) {
      return [{
        date: new Date().toISOString().split("T")[0],
        completed: 0,
      }];
    }

    const counts: Record<string, number> = {};
    completionDates.forEach(date => {
      counts[date] = (counts[date] || 0) + 1;
    });

    const chartData = [];
    let runningTotal = 0;

    for (const date of Object.keys(counts).sort()) {
      runningTotal += counts[date];
      chartData.push({
        date,
        completed: runningTotal,
      });
    }

    return chartData;
  }, [projects]);

  return (
    <div className="bg-dark-gray rounded-2xl border-1 border-zinc-700 p-5 w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ left: 40, right: 20, top: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="7 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="completed" stroke="#FF9400" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
