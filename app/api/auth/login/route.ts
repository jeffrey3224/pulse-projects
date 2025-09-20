
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/schema/db";
import { users } from "@/schema/db/schema";
import { signToken } from "@/lib/auth";

const SECRET = process.env.JWT_SECRET || "dev-secret";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json(); 
    if (!email || !password) 
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    console.log("login attempt:", email);
    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = rows[0];

    console.log("DB result:", rows);

    if (!user) 
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) 
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Login route error:", err);  // <--- log the full error here
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
