import { Router } from "express";
import { tasks } from "../controllers";


const router = Router();

router.get("/:projectId", tasks.getTasks);
router.get("/:projectId/:taskId", tasks.getOneTask);

router.post("/", tasks.createTask);
router.patch("/", tasks.updateTaskStatus);
export default router;
