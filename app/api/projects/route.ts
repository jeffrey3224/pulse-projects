import { verifyToken} from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/schema/db/schema";
import { db } from "@/schema/db";


export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token); 

  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, payload.id));

    return NextResponse.json(allProjects, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const userPayload = verifyToken(token);
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const inserted = await db
      .insert(projects)
      .values({
        userId: userPayload.id,
        title,
        description: description || "",
        dueDate: null,
      })
      .returning({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        dueDate: projects.dueDate,
        createdAt: projects.createdAt,
      });

    if (!inserted.length) {
      return NextResponse.json({ error: "Insert succeeded but returned nothing" }, { status: 500 });
    }

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (err) {
    console.error("Error adding project:", err);
    return NextResponse.json(
      { error: `Failed to add project: ${err.message}` },
      { status: 500 }
    );
  }
}

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
    const { projectId } = params;
    const body = await req.json();
    const { completed, title } = body;

    const updatedData: { completedAt?: Date | null; title?: string } = {};

    if (completed !== undefined) updatedData.completedAt = completed ? new Date() : null;
    if (title !== undefined) updatedData.title = title; 

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




