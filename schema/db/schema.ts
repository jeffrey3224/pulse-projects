import { pgTable, serial, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const steps = pgTable("steps", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(()=>projects.id),
  title: text("title").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completed: boolean("completed").default(false).notNull(),
})

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  stepId: integer("step_id").references(() => steps.id).notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})