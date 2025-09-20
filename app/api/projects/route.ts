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

  const rows = await db.select().from(projects).where(eq(projects.userId, payload.id)); 
  return NextResponse.json(rows, { status: 200 });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "not token provided"}, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  
  const { title, description } = await req.json();

  const inserted = await db
    .insert(projects)
    .values({ userId: payload.id, title, description })
    .returning();

  return NextResponse.json(inserted[0], { status: 201})
}