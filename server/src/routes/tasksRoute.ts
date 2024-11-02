import { Router } from "express";
import tasks from "../controllers/tasksController";


const router = Router();

router.get("/:projectId", tasks.getTasks);
router.get("/:projectId/:taskId", tasks.getOneTask);

// router.post("/", tasks.createTask);
// router.put("/:id", tasks.updateTask);
// router.delete("/:id", tasks.deleteTask);
export default router;