import { Router } from "express";
import { columns } from "../controllers";


const router = Router();

router.get("/:projectId", columns.getColumnsWithTasks);
router.get("/:projectId/:columnId", columns.getOneColumn);
router.post("/", columns.createColumn);

router.patch("/", columns.updateColumn);
router.delete("/:id", columns.deleteColumn);

export default router;
