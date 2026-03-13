import { Router } from "express";
import { db } from "@workspace/db";
import { studentProfilesTable, usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { UpdateProfileBody } from "@workspace/api-zod";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";

const router = Router();

function calcCompletion(profile: typeof studentProfilesTable.$inferSelect, fullName: string): number {
  const fields = [
    fullName,
    profile.college,
    profile.branch,
    profile.year,
    profile.targetRole,
    profile.bio,
    profile.skills.length > 0 ? "filled" : null,
    profile.interests.length > 0 ? "filled" : null,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  const [profile] = await db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, userId)).limit(1);

  if (!profile) {
    res.status(404).json({ error: "not_found", message: "Profile not found" });
    return;
  }

  res.json({
    id: profile.id,
    userId: profile.userId,
    fullName: user.fullName,
    email: user.email,
    college: profile.college,
    branch: profile.branch,
    year: profile.year,
    skills: profile.skills,
    interests: profile.interests,
    targetRole: profile.targetRole,
    bio: profile.bio,
    completionPercentage: calcCompletion(profile, user.fullName),
    updatedAt: profile.updatedAt,
  });
});

router.put("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  const [updated] = await db
    .update(studentProfilesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(studentProfilesTable.userId, userId))
    .returning();

  res.json({
    id: updated.id,
    userId: updated.userId,
    fullName: user.fullName,
    email: user.email,
    college: updated.college,
    branch: updated.branch,
    year: updated.year,
    skills: updated.skills,
    interests: updated.interests,
    targetRole: updated.targetRole,
    bio: updated.bio,
    completionPercentage: calcCompletion(updated, user.fullName),
    updatedAt: updated.updatedAt,
  });
});

export default router;
