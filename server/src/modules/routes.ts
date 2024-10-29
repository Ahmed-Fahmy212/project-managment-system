import { Router } from "express";
import projectRoutes from "./projects/route";

const router = Router();

router.use("/projects", projectRoutes);


export default router ;