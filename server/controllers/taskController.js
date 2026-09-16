import pool from "../db/connection.js";

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { project_id } = req.query;

    if (!project_id) {
      return res.status(400).json({
        error: "Project ID is required",
      });
    }

    const result = await pool.query(
      `SELECT t.*
       FROM tasks t
       INNER JOIN projects p
         ON t.project_id = p.id
       WHERE p.user_id = $1
         AND t.project_id = $2
       ORDER BY t.created_at DESC`,
      [userId, project_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to fetch tasks",
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      project_id,
      title,
      description,
      priority,
      status,
      due_date,
      assignee,
    } = req.body;

    // Verify that the selected project belongs to the logged-in user
    const projectResult = await pool.query(
      `SELECT id
       FROM projects
       WHERE id = $1
         AND user_id = $2`,
      [project_id, userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(403).json({
        error:
          "You do not have permission to add a task to this project",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks
       (project_id, title, description, priority, status, due_date, assignee)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        project_id,
        title,
        description,
        priority,
        status,
        due_date,
        assignee,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to create task",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const {
      project_id,
      title,
      description,
      priority,
      status,
      due_date,
      assignee,
    } = req.body;

    // Make sure the new/selected project belongs to the user
    const projectResult = await pool.query(
      `SELECT id
       FROM projects
       WHERE id = $1
         AND user_id = $2`,
      [project_id, userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(403).json({
        error: "You do not have permission to use this project",
      });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET project_id = $1,
           title = $2,
           description = $3,
           priority = $4,
           status = $5,
           due_date = $6,
           assignee = $7
       WHERE id = $8
         AND EXISTS (
           SELECT 1
           FROM projects
           WHERE projects.id = tasks.project_id
             AND projects.user_id = $9
         )
       RETURNING *`,
      [
        project_id,
        title,
        description,
        priority,
        status,
        due_date,
        assignee,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Task not found or you do not have permission",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to update task",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
         AND EXISTS (
           SELECT 1
           FROM projects
           WHERE projects.id = tasks.project_id
             AND projects.user_id = $2
         )
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Task not found or you do not have permission",
      });
    }

    res.json({
      message: "Task deleted successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to delete task",
    });
  }
};