import { Router } from "express";
import { tasks } from "../controllers";


const router = Router();

router.get("/:projectId", tasks.getTasks);
router.get("/:projectId/:taskId", tasks.getOneTask);
router.patch("/:taskId/status", tasks.updateTaskStatus);

router.post("/", tasks.createTask);
router.put("/:id", tasks.updateTaskStatus);
export default router;
