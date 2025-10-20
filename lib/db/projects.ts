import { db } from "@/schema/db";
import { projects } from "@/schema/db/schema";


export async function getProjects() {
  try {
    const result = await db.select().from(projects);
    return result;
  }
  catch (error) {
    console.error("Error fetching projects", error);
    throw new Error("Failed to fetch projects");
  }
}