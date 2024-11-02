import { Router } from "express";
import projects from "../controllers/projectController";


const router = Router();

router.get("/", projects.getProjects);
router.get("/:id", projects.getOneProject);

router.post("/", projects.createProject);
router.put("/:id", projects.updateProject);
router.delete("/:id", projects.deleteProject);
export default router;
