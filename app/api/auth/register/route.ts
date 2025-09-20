import { NextApiRequest, NextApiResponse } from "next";

import bcrypt from "bcrypt";
import { db } from "@/schema/db";
import { users } from "@/schema/db/schema";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body;

  if(!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await db.insert(users).values({
      name, 
      email,
      passwordHash: hashedPassword,
    }).returning();

    res.status(201).json({ id: newUser[0].id, name: newUser[0].name, email: newUser[0].email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User registration failed"})
  }
}