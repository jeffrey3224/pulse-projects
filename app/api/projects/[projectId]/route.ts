import { NextRequest, NextResponse } from "next/server";
import { db } from "@/schema/db";
import { projects } from "@/schema/db/schema";
import { and, eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const body = await req.json();
    const { dueDate, title, description } = body;

    const updatedData: {
      title?: string;
      description?: string;
      dueDate?: string | null;
    } = {};

    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (dueDate !== undefined) updatedData.dueDate = dueDate;

    if (Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await db
      .update(projects)
      .set(updatedData)
      .where(
        and(
          eq(projects.id, Number(params.projectId)),
          eq(projects.userId, payload.id)
        )
      )
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

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const project = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, Number(params.projectId)),
          eq(projects.userId, payload.id)
        )
      );

    if (!project.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project[0], { status: 200 });
  } catch (err) {
    console.error("Error fetching project:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
