import { db } from "@/schema/db";
import { users } from "@/schema/db/schema";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const rows = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
  const user = rows[0];

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
