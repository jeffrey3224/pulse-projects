import bcrypt from "bcrypt";
import { db } from "../schema/db/index";
import { users } from "../schema/db/schema";

async function createTestUser() {
  try {
    const password = "password123";
    const hash = await bcrypt.hash(password, 10);

    const [user] = await db.insert(users).values({
      name: "Test User",
      email: "test@example.com",
      passwordHash: hash,
    }).returning();

    console.log("✅ Created user:", user);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    process.exit(1);
  }
}

createTestUser();
