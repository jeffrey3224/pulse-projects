import { db } from "@/schema/db";
import { projects, steps } from "@/schema/db/schema";
import { sql } from "drizzle-orm";
import { Project, Step } from "../types/projects";

export async function getProjectById(projectId: number): Promise<Project | null> {
  try {
    const projectRow = await db
      .select()
      .from(projects)
      .where(sql`${projects.id} = ${projectId}`)
      .limit(1);

    if (!projectRow[0]) return null;

    const projectSteps: Step[] = await db
      .select()
      .from(steps)
      .where(sql`${steps.projectId} = ${projectId}`)
      .orderBy(steps.order);

    const project: Project = {
      ...projectRow[0],
      createdAt: projectRow[0].createdAt?.toISOString() ?? null,
      completedAt: projectRow[0].completedAt?.toISOString() ?? null,
      dueDate: projectRow[0].dueDate?.toString() ?? undefined,
      steps: projectSteps.map((step) => ({
        ...step
      })),
    };

    return project;
  } catch (error) {
    console.error("Error fetching project in DB:", error);
    throw error;
  }
}
