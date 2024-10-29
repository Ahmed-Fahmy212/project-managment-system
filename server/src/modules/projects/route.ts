import { Router } from "express";
import projects from "./projectController";
const router = Router();

router.get("/", projects.getProjects);
router.post("/", projects.createProject);

export default router;
