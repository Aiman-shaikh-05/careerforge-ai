import { Router } from "express";
import { db } from "@workspace/db";
import { roadmapsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { GenerateRoadmapBody } from "@workspace/api-zod";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";
import { generateRoadmap } from "../services/ai.js";

const router = Router();

router.post("/generate", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const parsed = GenerateRoadmapBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }
  const { targetRole, currentSkills, experienceLevel = "beginner" } = parsed.data;

  const milestones = generateRoadmap(targetRole, currentSkills, experienceLevel);

  const [saved] = await db.insert(roadmapsTable).values({
    userId,
    targetRole,
    milestones,
  }).returning();

  res.json({
    id: saved.id,
    userId: saved.userId,
    targetRole: saved.targetRole,
    milestones: saved.milestones,
    createdAt: saved.createdAt,
  });
});

router.get("/latest", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const [roadmap] = await db.select().from(roadmapsTable)
    .where(eq(roadmapsTable.userId, userId))
    .orderBy(desc(roadmapsTable.createdAt))
    .limit(1);

  if (!roadmap) {
    res.status(404).json({ error: "not_found", message: "No roadmap found" });
    return;
  }

  res.json({
    id: roadmap.id,
    userId: roadmap.userId,
    targetRole: roadmap.targetRole,
    milestones: roadmap.milestones,
    createdAt: roadmap.createdAt,
  });
});

export default router;
