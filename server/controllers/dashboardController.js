import pool from "../db/connection.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get the logged-in user's ID from the JWT middleware
    const userId = req.user.userId;

    const result = await pool.query(
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
          AND t.status = 'Pending'
        ) AS pending_tasks,

        (
          SELECT COUNT(*)
          FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.user_id = $1
          AND t.due_date < CURRENT_DATE
          AND t.status != 'Completed'
        ) AS overdue_tasks
      `,
      [userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to fetch dashboard statistics",
    });
  }
};