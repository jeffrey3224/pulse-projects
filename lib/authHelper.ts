import { db } from "@/schema/db";
import { projects, steps } from "@/schema/db/schema";
import { verifyToken } from "./auth";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function authenticateProjectStep(
  req: NextRequest,
  projectId: number,
  stepId: number
): Promise<{ projectId: number; stepId: number; userId: number }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");

  const token = authHeader.split(" ")[1];
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }

  const project = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, payload.id)));

  if (project.length === 0) throw new Error("Project not found");

  const step = await db
    .select()
    .from(steps)
    .where(and(eq(steps.id, stepId), eq(steps.projectId, projectId)));

  if (step.length === 0) throw new Error("Step not found");

  return { projectId, stepId, userId: payload.id };
}
