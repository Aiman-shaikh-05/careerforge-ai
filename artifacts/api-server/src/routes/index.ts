import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import profileRouter from "./profile.js";
import resumeRouter from "./resume.js";
import projectsRouter from "./projects.js";
import roadmapRouter from "./roadmap.js";
import jobsRouter from "./jobs.js";
import interviewRouter from "./interview.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/resume", resumeRouter);
router.use("/projects", projectsRouter);
router.use("/roadmap", roadmapRouter);
router.use("/jobs", jobsRouter);
router.use("/interview", interviewRouter);

export default router;
