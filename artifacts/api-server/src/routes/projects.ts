import { Router } from "express";
import { db } from "@workspace/db";
import { recommendedProjectsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { GetProjectRecommendationsBody } from "@workspace/api-zod";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";
import { generateProjectRecommendations } from "../services/ai.js";

const router = Router();

router.post("/recommend", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const parsed = GetProjectRecommendationsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }
  const { skills, interests, targetRole, count = 6 } = parsed.data;

  const projects = generateProjectRecommendations(skills, interests, targetRole, count);

  await db.delete(recommendedProjectsTable).where(eq(recommendedProjectsTable.userId, userId));
  const saved = await db.insert(recommendedProjectsTable).values(
    projects.map(p => ({
      userId,
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      domain: p.domain,
      techStack: p.techStack,
      whyItMatches: p.whyItMatches,
      estimatedHours: p.estimatedHours,
    }))
  ).returning();

  res.json(saved.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    difficulty: p.difficulty,
    domain: p.domain,
    techStack: p.techStack,
    whyItMatches: p.whyItMatches,
    estimatedHours: p.estimatedHours,
  })));
});

router.get("/saved", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const projects = await db.select().from(recommendedProjectsTable)
    .where(eq(recommendedProjectsTable.userId, userId));

  res.json(projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    difficulty: p.difficulty,
    domain: p.domain,
    techStack: p.techStack,
    whyItMatches: p.whyItMatches,
    estimatedHours: p.estimatedHours,
  })));
});

export default router;
