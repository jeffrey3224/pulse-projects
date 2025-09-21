import { NextRequest, NextResponse } from "next/server";
import { db } from "@/schema/db";
import { tasks } from "@/schema/db/schema";
import { eq} from "drizzle-orm";
import { authenticateProjectStep } from "@/lib/authHelper";

export async function GET( req: NextRequest, { params }: { params: { projectId: string; stepId: number; taskId: string }}) {

  const result = await authenticateProjectStep(req, Number(params.projectId), Number(params.stepId));
  if ("error" in result) throw new Error("Problem authenticating")

  const { stepId }= result;

  const allTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.stepId, stepId));

  return NextResponse.json(allTasks, { status: 200 });
}

export async function POST(req: NextRequest, { params }: { params: { projectId: string; stepId: number; taskId: string }}) {
  const result = await authenticateProjectStep(req, Number(params.projectId), Number(params.stepId));
  if ("error" in result) throw new Error("Problem authenticating")

  const { stepId } = result;
  const { title } = await req.json();
  if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

  const inserted = await db.insert(tasks).values({ stepId, title, completed: false }).returning();
  return NextResponse.json(inserted[0], { status: 201 });
}