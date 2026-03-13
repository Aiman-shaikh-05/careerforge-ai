import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const resumesTable = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  extractedText: text("extracted_text"),
  analysisStatus: text("analysis_status").notNull().default("pending"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const resumeFeedbackTable = pgTable("resume_feedback", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").notNull().references(() => resumesTable.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  strengths: jsonb("strengths").$type<string[]>().default([]).notNull(),
  missingSkills: jsonb("missing_skills").$type<string[]>().default([]).notNull(),
  improvements: jsonb("improvements").$type<string[]>().default([]).notNull(),
  atsScore: integer("ats_score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResumeSchema = createInsertSchema(resumesTable).omit({ id: true, uploadedAt: true });
export const insertResumeFeedbackSchema = createInsertSchema(resumeFeedbackTable).omit({ id: true, createdAt: true });
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumesTable.$inferSelect;
export type InsertResumeFeedback = z.infer<typeof insertResumeFeedbackSchema>;
export type ResumeFeedback = typeof resumeFeedbackTable.$inferSelect;
