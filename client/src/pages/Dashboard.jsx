import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);

  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/dashboard");

        console.log("Dashboard stats:", response.data);

        setStats(response.data);
      } catch (error) {
        console.error(
          "Error fetching dashboard stats:",
          error
        );
      }
    };

    fetchDashboardStats();
  }, []);

  const generateProjectHealth = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      setAiSummary("");

      const response = await api.post("/ai/project-health", {
        total_projects: Number(stats?.total_projects ?? 0),
        total_tasks: Number(stats?.total_tasks ?? 0),

        completed_tasks: Number(
          stats?.completed_tasks ?? 0
        ),

        todo_tasks: Number(
          stats?.todo_tasks ?? 0
        ),

        in_progress_tasks: Number(
          stats?.in_progress_tasks ?? 0
        ),

        overdue_tasks: Number(
          stats?.overdue_tasks ?? 0
        ),

        completed_projects: Number(
          stats?.completed_projects ?? 0
        ),

        todo_projects: Number(
          stats?.todo_projects ?? 0
        ),

        in_progress_projects: Number(
          stats?.in_progress_projects ?? 0
        ),
      });

      setAiSummary(response.data.summary);
    } catch (error) {
      console.error(
        "Error generating project health:",
        error
      );

      setAiError(
        "Unable to generate project health summary."
      );
    } finally {
      setAiLoading(false);
    }
  };

  if (!stats) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <h2>Loading dashboard...</h2>
          <p>Preparing your project overview.</p>
        </div>
      </div>
    );
  }

  /*
    Convert API values to numbers.
    The ?? 0 also prevents undefined/null values
    from causing NaN.
  */

  const totalProjects = Number(
    stats.total_projects ?? 0
  );

  const totalTasks = Number(
    stats.total_tasks ?? 0
  );

  const completedTasks = Number(
    stats.completed_tasks ?? 0
  );

  const todoTasks = Number(
    stats.todo_tasks ?? 0
  );

  const inProgressTasks = Number(
    stats.in_progress_tasks ?? 0
  );

  const overdueTasks = Number(
    stats.overdue_tasks ?? 0
  );

  const completedProjects = Number(
    stats.completed_projects ?? 0
  );

  const todoProjects = Number(
    stats.todo_projects ?? 0
  );

  const inProgressProjects = Number(
    stats.in_progress_projects ?? 0
  );

  /*
    Task percentages
  */

  const completedTaskPercentage =
    totalTasks > 0
      ? (completedTasks / totalTasks) * 100
      : 0;

  const todoTaskPercentage =
    totalTasks > 0
      ? (todoTasks / totalTasks) * 100
      : 0;

  const inProgressTaskPercentage =
    totalTasks > 0
      ? (inProgressTasks / totalTasks) * 100
      : 0;

  /*
    Project percentages
  */

  const completedProjectPercentage =
    totalProjects > 0
      ? (completedProjects / totalProjects) * 100
      : 0;

  const todoProjectPercentage =
    totalProjects > 0
      ? (todoProjects / totalProjects) * 100
      : 0;

  const inProgressProjectPercentage =
    totalProjects > 0
      ? (inProgressProjects / totalProjects) * 100
      : 0;

  return (
    <div className="dashboard-page">

      {/* =========================
          DASHBOARD HEADER
      ========================= */}

      <div className="dashboard-header">

        <div className="dashboard-title-row">
          <span className="dashboard-icon">
            ✦
          </span>

          <h1>Dashboard</h1>
        </div>

        <p>
          Welcome back, 👋
          &nbsp; Here's an overview of your
          projects and tasks.
        </p>

      </div>


      {/* =========================
          STATISTICS CARDS
      ========================= */}

      <div className="dashboard-stats">

        {/* Total Projects */}

        <div className="stat-card stat-projects">

          <div className="stat-card-top">
            <span className="stat-label">
              TOTAL PROJECTS
            </span>

            <span className="stat-icon">
              P
            </span>
          </div>

          <p className="stat-number">
            {totalProjects}
          </p>

          <p className="stat-description">
            Projects you're managing
          </p>

        </div>


        {/* Total Tasks */}

        <div className="stat-card stat-tasks">

          <div className="stat-card-top">
            <span className="stat-label">
              TOTAL TASKS
            </span>

            <span className="stat-icon">
              T
            </span>
          </div>

          <p className="stat-number">
            {totalTasks}
          </p>

          <p className="stat-description">
            Tasks across your projects
          </p>

        </div>


        {/* Completed */}

        <div className="stat-card stat-completed">

          <div className="stat-card-top">
            <span className="stat-label">
              COMPLETED
            </span>

            <span className="stat-icon">
              ✓
            </span>
          </div>

          <p className="stat-number">
            {completedTasks}
          </p>

          <p className="stat-description">
            Tasks completed
          </p>

        </div>


        {/* Todo */}

        <div className="stat-card stat-todo">

          <div className="stat-card-top">
            <span className="stat-label">
              TODO
            </span>

            <span className="stat-icon">
              ○
            </span>
          </div>

          <p className="stat-number">
            {todoTasks}
          </p>

          <p className="stat-description">
            Tasks waiting to be completed
          </p>

        </div>


        {/* In Progress */}

        <div className="stat-card stat-progress">

          <div className="stat-card-top">
            <span className="stat-label">
              IN PROGRESS
            </span>

            <span className="stat-icon">
              →
            </span>
          </div>

          <p className="stat-number">
            {inProgressTasks}
          </p>

          <p className="stat-description">
            Tasks currently in progress
          </p>

        </div>


        {/* Overdue */}

        <div className="stat-card overdue-card">

          <div className="stat-card-top">
            <span className="stat-label">
              OVERDUE
            </span>

            <span className="stat-icon">
              !
            </span>
          </div>

          <p className="stat-number">
            {overdueTasks}
          </p>

          <p className="stat-description">
            Tasks past their due date
          </p>

        </div>

      </div>


      {/* =========================
          STATUS SECTIONS
      ========================= */}

      <div className="dashboard-charts">

        {/* =====================
            TASK STATUS
        ===================== */}

        <div className="dashboard-chart-card">

          <h2>Task Status</h2>

          <div className="chart-bars">

            {/* Completed */}

            <div className="chart-row">

              <div className="chart-row-label">
                <span>Completed</span>

                <strong>
                  {completedTasks}
                </strong>
              </div>

              <div className="chart-track">

                <div
                  className="chart-bar completed-bar"
                  style={{
                    width: `${completedTaskPercentage}%`,
                  }}
                ></div>

              </div>

            </div>


            {/* Todo */}

            <div className="chart-row">

              <div className="chart-row-label">
                <span>Todo</span>

                <strong>
                  {todoTasks}
                </strong>
              </div>

              <div className="chart-track">

                <div
                  className="chart-bar todo-bar"
                  style={{
                    width: `${todoTaskPercentage}%`,
                  }}
                ></div>

              </div>

            </div>


            {/* In Progress */}

            <div className="chart-row">

              <div className="chart-row-label">
                <span>In Progress</span>

                <strong>
                  {inProgressTasks}
                </strong>
              </div>

              <div className="chart-track">

                <div
                  className="chart-bar progress-bar"
                  style={{
                    width: `${inProgressTaskPercentage}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================
            PROJECT STATUS
        ===================== */}

        <div className="dashboard-chart-card">

          <h2>Project Status</h2>

          <div className="chart-bars">

            {/* Completed */}

            <div className="chart-row">

              <div className="chart-row-label">
                <span>Completed</span>

                <strong>
                  {completedProjects}
                </strong>
              </div>

              <div className="chart-track">

                <div
                  className="chart-bar completed-bar"
                  style={{
                    width: `${completedProjectPercentage}%`,
                  }}
                ></div>

              </div>

            </div>


            {/* Todo */}

            <div className="chart-row">

              <div className="chart-row-label">
                <span>Todo</span>

                <strong>
                  {todoProjects}
                </strong>
              </div>

              <div className="chart-track">

                <div
                  className="chart-bar todo-bar"
                  style={{
                    width: `${todoProjectPercentage}%`,
                  }}
                ></div>

              </div>

            </div>


            {/* In Progress */}

            <div className="chart-row">

              <div className="chart-row-label">
                <span>In Progress</span>

                <strong>
                  {inProgressProjects}
                </strong>
              </div>

              <div className="chart-track">

                <div
                  className="chart-bar progress-bar"
                  style={{
                    width: `${inProgressProjectPercentage}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          AI PROJECT HEALTH
      ========================= */}

      <div className="dashboard-ai-card">

        <div className="dashboard-ai-content">

          <div className="dashboard-ai-icon">
            ✦
          </div>

          <div>

            <h2>
              AI Project Health
            </h2>

            <p>
              Get an AI-generated summary
              of your current project and
              task health.
            </p>

          </div>

        </div>


        <button
          className="ai-health-button"
          onClick={generateProjectHealth}
          disabled={aiLoading}
        >
          {aiLoading
            ? "Analyzing..."
            : "Analyze Project Health"}
        </button>


        {/* AI Result */}

        {aiSummary && (
          <div className="ai-health-result">
            {aiSummary}
          </div>
        )}


        {/* AI Error */}

        {aiError && (
          <div className="ai-health-error">
            {aiError}
          </div>
        )}

      </div>


      {/* =========================
          FOOTER
      ========================= */}

      <div className="dashboard-branding">
        <strong>Planexa AI</strong>
        <span> - project management</span>
      </div>

    </div>
  );
}

export default Dashboard;