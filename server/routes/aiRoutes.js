import express from "express";

import {
  generateProjectDescription,
  generateTasks,
  generateTaskDescription,
  generateProjectHealth,
} from "../controllers/aiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Project description
router.post(
  "/generate-description",
  authMiddleware,
  generateProjectDescription
);

// Task generator
router.post(
  "/generate-tasks",
  authMiddleware,
  generateTasks
);

// Task description
router.post(
  "/generate-task-description",
  authMiddleware,
  generateTaskDescription
);

// Project health summary
router.post(
  "/project-health",
  authMiddleware,
  generateProjectHealth
);

export default router;