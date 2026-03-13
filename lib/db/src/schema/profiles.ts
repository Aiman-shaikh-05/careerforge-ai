import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const studentProfilesTable = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  college: text("college"),
  branch: text("branch"),
  year: text("year"),
  skills: jsonb("skills").$type<string[]>().default([]).notNull(),
  interests: jsonb("interests").$type<string[]>().default([]).notNull(),
  targetRole: text("target_role"),
  bio: text("bio"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStudentProfileSchema = createInsertSchema(studentProfilesTable).omit({ id: true, updatedAt: true });
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type StudentProfile = typeof studentProfilesTable.$inferSelect;
