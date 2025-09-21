import bcrypt from "bcrypt";
import { db } from "@/schema/db";
import { users } from "@/schema/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: hashedPassword,
      })
      .returning();

    return NextResponse.json(
      {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "User registration failed" },
      { status: 500 }
    );
  }
}
