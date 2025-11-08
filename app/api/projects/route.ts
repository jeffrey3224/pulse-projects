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
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const userPayload = verifyToken(token);

    const { title, description, dueDate } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const inserted = await db
      .insert(projects)
      .values({
        userId: userPayload.id,       // match DB column
        title,
        description: description || "",
        dueDate: dueDate || null,     // send null if empty
      })
      .returning();

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (err) {
    console.error("❌ Error adding project:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}
