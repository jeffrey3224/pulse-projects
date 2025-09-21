import { db } from "@/schema/db";
import { tasks } from "@/schema/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { authenticateProjectStep } from "@/lib/authHelper";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string; stepId: string; taskId: string } }
) {
  try {
    const { stepId } = await authenticateProjectStep(
      req,
      Number(params.projectId),
      Number(params.stepId)
    );

    const taskIdNum = Number(params.taskId);

    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskIdNum), eq(tasks.stepId, stepId)));

    if (task.length === 0)
      throw new Error("Task not found")

    return NextResponse.json(task[0], { status: 200 });
  } catch (err) {
    throw new Error("Error fetching task")
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string; stepId: string; taskId: string } }
) {
  try {
    const { stepId } = await authenticateProjectStep(
      req,
      Number(params.projectId),
      Number(params.stepId)
    );

    const taskIdNum = Number(params.taskId);

    const deleted = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskIdNum), eq(tasks.stepId, stepId)))
      .returning();

    if (deleted.length === 0)
      throw new Error("Can't find task")

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    throw new Error("Error deleting task")
  }
}

export async function PATCH(
  req: NextRequest, 
  { params }: { params: { projectId: string; stepId: string; taskId: string }}
) {
  try {
    const { stepId } = await authenticateProjectStep(
      req,
      Number(params.projectId),
      Number(params.stepId)
    );

    const taskIdNum = Number(params.taskId);

    const body = await req.json();
    const { title, completed } = body;

    if (title === undefined && completed === undefined) {
      throw new Error("Nothing to update");
    }

    const updated = await db
      .update(tasks)
      .set({
        ...(title !== undefined ? { title } : {}),
        ...(completed !== undefined ? { completed } : {}),
      })
      .where(
        and(
          eq(tasks.id, taskIdNum),
          eq(tasks.stepId, stepId)
        )
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (err) {
    throw new Error("Error updating task")
  }
}
