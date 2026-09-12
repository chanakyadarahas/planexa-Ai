import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/dashboard");
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

  return (
    <div className="dashboard-page">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-title-row">
            <span className="dashboard-icon">✦</span>
            <h1>Dashboard</h1>
          </div>

          <p>
            Here's an overview of your projects and tasks.
          </p>
        </div>
      </div>


      {/* Statistics */}
      <div className="dashboard-stats">

        {/* Total Projects */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Total Projects
            </span>

            <span className="stat-icon">
              P
            </span>
          </div>

          <p className="stat-number">
            {stats.total_projects}
          </p>

          <p className="stat-description">
            Projects you're managing
          </p>
        </div>


        {/* Total Tasks */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Total Tasks
            </span>

            <span className="stat-icon">
              T
            </span>
          </div>

          <p className="stat-number">
            {stats.total_tasks}
          </p>

          <p className="stat-description">
            Tasks across your projects
          </p>
        </div>


        {/* Completed */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Completed
            </span>

            <span className="stat-icon">
              ✓
            </span>
          </div>

          <p className="stat-number">
            {stats.completed_tasks}
          </p>

          <p className="stat-description">
            Tasks completed
          </p>
        </div>


        {/* Pending */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Pending
            </span>

            <span className="stat-icon">
              ○
            </span>
          </div>

          <p className="stat-number">
            {stats.pending_tasks}
          </p>

          <p className="stat-description">
            Tasks waiting to be completed
          </p>
        </div>


        {/* Overdue */}
        <div className="stat-card overdue-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Overdue
            </span>

            <span className="stat-icon">
              !
            </span>
          </div>

          <p className="stat-number">
            {stats.overdue_tasks}
          </p>

          <p className="stat-description">
            Tasks past their due date
          </p>
        </div>

      </div>


      {/* Dashboard Welcome Panel */}
      <div className="dashboard-welcome">

        <div>
          <span className="welcome-label">
            PLANEXA AI
          </span>

          <h2>
            Keep your projects moving forward.
          </h2>

          <p>
            Manage projects, organize tasks, and use AI
            to help you plan your work more efficiently.
          </p>
        </div>

        <div className="welcome-symbol">
          ✦
        </div>

      </div>

    </div>
  );
}

export default Dashboard;