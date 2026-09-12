import pool from "../db/connection.js";

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT
        p.*,
        COUNT(t.id) AS total_tasks,
        COUNT(t.id) FILTER (WHERE t.status = 'Completed') AS completed_tasks
      FROM projects p
      LEFT JOIN tasks t
        ON p.id = t.project_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.id;
      `,
      [userId]
    );

    const projects = result.rows.map((project) => {
      const totalTasks = Number(project.total_tasks);
      const completedTasks = Number(project.completed_tasks);

      const progress =
        totalTasks === 0
          ? 0
          : Math.round((completedTasks / totalTasks) * 100);

      return {
        ...project,
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        progress,
      };
    });

    res.json(projects);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to fetch projects",
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      name,
      description,
      status,
      start_date,
      due_date,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO projects
       (name, description, status, start_date, due_date, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        description,
        status,
        start_date,
        due_date,
        userId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to create project",
    });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const {
      name,
      description,
      status,
      start_date,
      due_date,
    } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET name = $1,
           description = $2,
           status = $3,
           start_date = $4,
           due_date = $5
       WHERE id = $6
       AND user_id = $7
       RETURNING *`,
      [
        name,
        description,
        status,
        start_date,
        due_date,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found or you do not have permission",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to update project",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `DELETE FROM projects
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found or you do not have permission",
      });
    }

    res.json({
      message: "Project deleted successfully",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to delete project",
    });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT t.*
       FROM tasks t
       INNER JOIN projects p
         ON t.project_id = p.id
       WHERE t.project_id = $1
         AND p.user_id = $2
       ORDER BY t.created_at DESC`,
      [id, userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to fetch project tasks",
    });
  }
};

export const getProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT
         COUNT(t.id) AS total_tasks,
         COUNT(t.id) FILTER (WHERE t.status = 'Completed') AS completed_tasks
       FROM tasks t
       INNER JOIN projects p
         ON t.project_id = p.id
       WHERE t.project_id = $1
         AND p.user_id = $2`,
      [id, userId]
    );

    const totalTasks = Number(result.rows[0].total_tasks);
    const completedTasks = Number(result.rows[0].completed_tasks);

    const progress =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      project_id: Number(id),
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      progress: `${progress}%`,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      error: "Failed to calculate project progress",
    });
  }
};