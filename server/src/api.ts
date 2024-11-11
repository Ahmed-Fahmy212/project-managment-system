import { Router } from "express";
import projectRoutes from "./routes/projectsRoute";
import taskRoutes from "./routes/tasksRoute";
import columnRoutes from "./routes/columnsRoute";
const router = Router();

router.get("/", (req, res) => {
    res.send("This is home route");
});

router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes)
router.use("/columns", columnRoutes)

export default router;