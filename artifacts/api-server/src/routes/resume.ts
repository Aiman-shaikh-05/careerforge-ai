import { Router } from "express";
import multer from "multer";
import path from "path";
import { db } from "@workspace/db";
import { resumesTable, resumeFeedbackTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";
import { generateResumeFeedback } from "../services/ai.js";

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const resumes = await db.select().from(resumesTable).where(eq(resumesTable.userId, userId));
  res.json(resumes.map(r => ({
    id: r.id,
    userId: r.userId,
    fileName: r.fileName,
    fileSize: r.fileSize,
    uploadedAt: r.uploadedAt,
    analysisStatus: r.analysisStatus,
  })));
});

router.post("/", requireAuth, upload.single("file"), async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  if (!req.file) {
    res.status(400).json({ error: "bad_request", message: "No file uploaded" });
    return;
  }

  const [resume] = await db.insert(resumesTable).values({
    userId,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    filePath: req.file.path,
    analysisStatus: "pending",
  }).returning();

  res.status(201).json({
    id: resume.id,
    userId: resume.userId,
    fileName: resume.fileName,
    fileSize: resume.fileSize,
    uploadedAt: resume.uploadedAt,
    analysisStatus: resume.analysisStatus,
  });
});

router.post("/:resumeId/analyze", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const resumeId = parseInt(req.params.resumeId as string);

  const [resume] = await db.select().from(resumesTable)
    .where(and(eq(resumesTable.id, resumeId), eq(resumesTable.userId, userId))).limit(1);

  if (!resume) {
    res.status(404).json({ error: "not_found", message: "Resume not found" });
    return;
  }

  await db.update(resumesTable).set({ analysisStatus: "processing" }).where(eq(resumesTable.id, resumeId));

  const feedback = generateResumeFeedback(resume.fileName);

  const [saved] = await db.insert(resumeFeedbackTable).values({
    resumeId,
    summary: feedback.summary,
    strengths: feedback.strengths,
    missingSkills: feedback.missingSkills,
    improvements: feedback.improvements,
    atsScore: feedback.atsScore,
  }).returning();

  await db.update(resumesTable).set({ analysisStatus: "completed" }).where(eq(resumesTable.id, resumeId));

  res.json({
    id: saved.id,
    resumeId: saved.resumeId,
    summary: saved.summary,
    strengths: saved.strengths,
    missingSkills: saved.missingSkills,
    improvements: saved.improvements,
    atsScore: saved.atsScore,
    createdAt: saved.createdAt,
  });
});

router.get("/:resumeId/feedback", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const resumeId = parseInt(req.params.resumeId as string);

  const [resume] = await db.select().from(resumesTable)
    .where(and(eq(resumesTable.id, resumeId), eq(resumesTable.userId, userId))).limit(1);

  if (!resume) {
    res.status(404).json({ error: "not_found", message: "Resume not found" });
    return;
  }

  const [feedback] = await db.select().from(resumeFeedbackTable)
    .where(eq(resumeFeedbackTable.resumeId, resumeId))
    .orderBy(resumeFeedbackTable.createdAt)
    .limit(1);

  if (!feedback) {
    res.status(404).json({ error: "not_found", message: "No feedback found for this resume" });
    return;
  }

  res.json({
    id: feedback.id,
    resumeId: feedback.resumeId,
    summary: feedback.summary,
    strengths: feedback.strengths,
    missingSkills: feedback.missingSkills,
    improvements: feedback.improvements,
    atsScore: feedback.atsScore,
    createdAt: feedback.createdAt,
  });
});

export default router;
