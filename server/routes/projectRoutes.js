import express from "express";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
  getProjectProgress,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getProjects);

router.post("/", createProject);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

router.get("/:id/tasks", getProjectTasks);

router.get("/:id/progress", getProjectProgress);

export default router;