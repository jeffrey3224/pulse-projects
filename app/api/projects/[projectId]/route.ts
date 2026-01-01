import { NextRequest, NextResponse } from "next/server";
import { db } from "@/schema/db";
import { projects } from "@/schema/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const { projectId } = params;
    const body = await req.json();
    const { dueDate } = body;

    const updatedData: { dueDate?: string | null } = {};
    if (dueDate !== undefined) updatedData.dueDate = dueDate; // Drizzle will convert string to date

    const updated = await db
      .update(projects)
      .set(updatedData)
      .where(eq(projects.id, Number(projectId)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (err) {
    console.error("Error updating project:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// Optional: GET for fetching a single project
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, Number(projectId)));

    if (!project.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project[0], { status: 200 });
  } catch (err) {
    console.error("Error fetching project:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
