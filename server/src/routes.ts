import { Router } from "express";
import projectRoutes from "./routes/projectsRoute";
import taskRoutes from "./routes/tasksRoute";

const router = Router();

router.get("/", (req, res) => {
    res.send("This is home route");
});

router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes)

export default router;