import pool from "../db/connection.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get logged-in user's name
    const userResult = await pool.query(
      `
      SELECT username
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const username = userResult.rows[0].username;

    // Get dashboard statistics
    const statsResult = await pool.query(
      `
      SELECT
        (
          SELECT COUNT(*)
          FROM projects
          WHERE user_id = $1
        ) AS total_projects,

        (
          SELECT COUNT(*)
          FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.user_id = $1
        ) AS total_tasks,

        (
          SELECT COUNT(*)
          FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.user_id = $1
          AND t.status = 'Completed'
        ) AS completed_tasks,

        (
          SELECT COUNT(*)
          FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.user_id = $1
          AND t.status = 'Todo'
        ) AS todo_tasks,

        (
          SELECT COUNT(*)
          FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.user_id = $1
          AND t.status = 'In Progress'
        ) AS in_progress_tasks,

        (
          SELECT COUNT(*)
          FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.user_id = $1
          AND t.due_date < CURRENT_DATE
          AND t.status != 'Completed'
        ) AS overdue_tasks,

        (
          SELECT COUNT(*)
          FROM projects
          WHERE user_id = $1
          AND status = 'Completed'
        ) AS completed_projects,

        (
          SELECT COUNT(*)
          FROM projects
          WHERE user_id = $1
          AND status = 'Todo'
        ) AS todo_projects,

        (
          SELECT COUNT(*)
          FROM projects
          WHERE user_id = $1
          AND status = 'In Progress'
        ) AS in_progress_projects
      `,
      [userId]
    );

    res.json({
      username,
      ...statsResult.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to fetch dashboard statistics",
    });
  }
};