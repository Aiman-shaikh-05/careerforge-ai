import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const recommendedProjectsTable = pgTable("recommended_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  domain: text("domain").notNull(),
  techStack: jsonb("tech_stack").$type<string[]>().default([]).notNull(),
  whyItMatches: text("why_it_matches").notNull(),
  estimatedHours: integer("estimated_hours").notNull().default(40),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roadmapsTable = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  targetRole: text("target_role").notNull(),
  milestones: jsonb("milestones").$type<RoadmapMilestone[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roleRecommendationsTable = pgTable("role_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requiredSkills: jsonb("required_skills").$type<string[]>().default([]).notNull(),
  matchPercentage: integer("match_percentage").notNull().default(0),
  salaryRange: text("salary_range").notNull(),
  growthOutlook: text("growth_outlook").notNull(),
  whyItMatches: text("why_it_matches").notNull(),
  domain: text("domain").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mockInterviewSessionsTable = pgTable("mock_interview_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  targetRole: text("target_role").notNull(),
  questions: jsonb("questions").$type<InterviewQuestion[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RoadmapMilestone = {
  id: number;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  topics: string[];
  resources: string[];
  estimatedWeeks: number;
  order: number;
};

export type InterviewQuestion = {
  id: number;
  question: string;
  category: "technical" | "hr" | "project_based";
  difficulty: "easy" | "medium" | "hard";
  hint?: string | null;
};

export const insertRecommendedProjectSchema = createInsertSchema(recommendedProjectsTable).omit({ id: true, createdAt: true });
export const insertRoadmapSchema = createInsertSchema(roadmapsTable).omit({ id: true, createdAt: true });
export const insertRoleRecommendationSchema = createInsertSchema(roleRecommendationsTable).omit({ id: true, createdAt: true });
export const insertMockInterviewSessionSchema = createInsertSchema(mockInterviewSessionsTable).omit({ id: true, createdAt: true });

export type InsertRecommendedProject = z.infer<typeof insertRecommendedProjectSchema>;
export type RecommendedProject = typeof recommendedProjectsTable.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Roadmap = typeof roadmapsTable.$inferSelect;
export type InsertRoleRecommendation = z.infer<typeof insertRoleRecommendationSchema>;
export type RoleRecommendation = typeof roleRecommendationsTable.$inferSelect;
export type InsertMockInterviewSession = z.infer<typeof insertMockInterviewSessionSchema>;
export type MockInterviewSession = typeof mockInterviewSessionsTable.$inferSelect;
