// app/api/projects/[projectId]/steps/route.ts
import { db } from "@/schema/db";
import { steps } from "@/schema/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { authenticateProject } from "@/lib/authHelper";
import { eq } from "drizzle-orm";

type Params = {
  projectId: string;
  stepId: string;
};


export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const authResult = await authenticateProject(req, Number(params.projectId));
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: 403 });
    }

    const projectSteps = await db
      .select()
      .from(steps)
      .where(eq(steps.projectId, Number(params.projectId)));

    return NextResponse.json(projectSteps, { status: 200 });
  } catch (err) {
    console.error("Steps fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch steps" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    // 🔐 Auth + ownership check
    const { projectId } = await authenticateProject(
      req,
      Number(params.projectId)
    );

    // 📦 Body
    const { title } = await req.json();

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    
    const inserted = await db
      .insert(steps)
      .values({
        title,
        projectId,
        completed: false,
      })
      .returning();

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error creating step" },
      { status: 500 }
    );
  }
}

