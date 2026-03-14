import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import resumeRouter from "./resume";
import projectsRouter from "./projects";
import roadmapRouter from "./roadmap";
import jobsRouter from "./jobs";
import interviewRouter from "./interview";

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
