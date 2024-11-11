import { Router } from "express";
import { columns } from "../controllers";


const router = Router();

router.get("/:projectId", columns.getColumnsWithTasks);

export default router;
