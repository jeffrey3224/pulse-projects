
import { db } from "@/schema/db";
import { projects, steps } from "@/schema/db/schema";
import { verifyToken } from "./auth";
import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { useAuth } from "./AuthContext";

export async function authenticateProject(req: NextRequest, projectId: number) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return { error: "Unauthorized" };

  const token = authHeader.split(" ")[1];
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return { error: "Unauthorized" };
  }

  const project = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, payload.id)));

  if (project.length === 0) return { error: "Unauthorized" };

  return { projectId, userId: payload.id };
}

export async function authenticateProjectStep(
  req: NextRequest,
  projectId: number,
  stepId: number
) {
  const authResult = await authenticateProject(req, projectId);

  if ("error" in authResult) {
    throw new Error(authResult.error);
  }

  const step = await db
    .select()
    .from(steps)
    .where(
      and(
        eq(steps.id, stepId),
        eq(steps.projectId, projectId)
      )
    );

  if (step.length === 0) {
    throw new Error("Step not found");
  }

  return {
    projectId,
    stepId,
    userId: authResult.userId,
  };
}


