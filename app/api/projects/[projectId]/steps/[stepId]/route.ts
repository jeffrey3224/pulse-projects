import { verifyToken } from "@/lib/auth";
import { authenticateProjectStep, authenticateProject } from "@/lib/authHelper";
import { db } from "@/schema/db";
import { projects, steps } from "@/schema/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  projectId: string;
  stepId: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  const projectId = Number(params.projectId);
  const stepId = Number(params.stepId);

  const project = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.id, projectId),
        eq(projects.userId, payload.id)
      )
    );

  if (project.length === 0) {
    return NextResponse.json(
      { error: "Project not found or not owned by user" },
      { status: 404 }
    );
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
    return NextResponse.json({ error: "Step not found" }, { status: 404 });
  }

  return NextResponse.json(step[0], { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { projectId, stepId } = await authenticateProjectStep(
      req,
      Number(params.projectId),
      Number(params.stepId)
    );

    const body = await req.json();
    const { title, order, completed } = body;

    if (title === undefined && order === undefined && completed === undefined) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(steps)
      .set({
        ...(title !== undefined ? { title } : {}),
        ...(order !== undefined ? { order } : {}),
        ...(completed !== undefined ? { completed } : {}),
      })
      .where(
        and(
          eq(steps.id, stepId),
          eq(steps.projectId, projectId)
        )
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error updating step" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { projectId, stepId } = await authenticateProjectStep(
      req,
      Number(params.projectId),
      Number(params.stepId)
    );

    const deleted = await db
      .delete(steps)
      .where(
        and(
          eq(steps.id, stepId),
          eq(steps.projectId, projectId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error deleting step" },
      { status: 500 }
    );
  }
}

