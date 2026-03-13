import { Router } from "express";
import { db } from "@workspace/db";
import { roleRecommendationsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { GetJobRecommendationsBody } from "@workspace/api-zod";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";
import { generateJobRecommendations } from "../services/ai.js";

const router = Router();

router.post("/recommend", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const parsed = GetJobRecommendationsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }
  const { skills, interests, targetRole } = parsed.data;

  const jobs = generateJobRecommendations(skills, interests, targetRole);

  await db.delete(roleRecommendationsTable).where(eq(roleRecommendationsTable.userId, userId));
  const saved = await db.insert(roleRecommendationsTable).values(
    jobs.map(j => ({
      userId,
      title: j.title,
      description: j.description,
      requiredSkills: j.requiredSkills,
      matchPercentage: j.matchPercentage,
      salaryRange: j.salaryRange,
      growthOutlook: j.growthOutlook,
      whyItMatches: j.whyItMatches,
      domain: j.domain,
    }))
  ).returning();

  res.json(saved.map(j => ({
    id: j.id,
    title: j.title,
    description: j.description,
    requiredSkills: j.requiredSkills,
    matchPercentage: j.matchPercentage,
    salaryRange: j.salaryRange,
    growthOutlook: j.growthOutlook,
    whyItMatches: j.whyItMatches,
    domain: j.domain,
  })));
});

router.get("/saved", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const jobs = await db.select().from(roleRecommendationsTable)
    .where(eq(roleRecommendationsTable.userId, userId));

  res.json(jobs.map(j => ({
    id: j.id,
    title: j.title,
    description: j.description,
    requiredSkills: j.requiredSkills,
    matchPercentage: j.matchPercentage,
    salaryRange: j.salaryRange,
    growthOutlook: j.growthOutlook,
    whyItMatches: j.whyItMatches,
    domain: j.domain,
  })));
});

export default router;
