import { Router } from "express";
import { db } from "@workspace/db";
import { mockInterviewSessionsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { GenerateInterviewQuestionsBody } from "@workspace/api-zod";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";
import { generateInterviewQuestions } from "../services/ai.js";

const router = Router();

router.post("/generate", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const parsed = GenerateInterviewQuestionsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }
  const { targetRole, skills, questionCount = 10 } = parsed.data;

  const questions = generateInterviewQuestions(targetRole, skills, questionCount);

  const [session] = await db.insert(mockInterviewSessionsTable).values({
    userId,
    targetRole,
    questions,
  }).returning();

  res.json({
    id: session.id,
    userId: session.userId,
    targetRole: session.targetRole,
    questions: session.questions,
    createdAt: session.createdAt,
  });
});

router.get("/sessions", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const sessions = await db.select().from(mockInterviewSessionsTable)
    .where(eq(mockInterviewSessionsTable.userId, userId))
    .orderBy(desc(mockInterviewSessionsTable.createdAt))
    .limit(10);

  res.json(sessions.map(s => ({
    id: s.id,
    userId: s.userId,
    targetRole: s.targetRole,
    questions: s.questions,
    createdAt: s.createdAt,
  })));
});

export default router;
