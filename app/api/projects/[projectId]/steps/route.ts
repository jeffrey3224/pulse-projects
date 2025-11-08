// app/api/projects/[projectId]/steps/route.ts
import { db } from "@/schema/db";
import { steps } from "@/schema/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { authenticateProject } from "@/lib/authHelper";
import { eq } from "drizzle-orm";

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
