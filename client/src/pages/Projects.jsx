import { useEffect, useState } from "react";
import api from "../api/axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Todo",
    start_date: "",
    due_date: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await api.get("/projects");

      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);

      setFormError(
        error.response?.data?.error ||
          "Failed to load projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const generateProjectDescription = async () => {
    if (!formData.name.trim()) {
      setAiError("Please enter a project name first.");
      return;
    }

    try {
      setAiLoading(true);
      setAiError("");

      const response = await api.post(
        "/ai/generate-description",
        {
          projectName: formData.name,
        }
      );

      setFormData({
        ...formData,
        description: response.data.description,
      });
    } catch (error) {
      console.error(
        "Error generating project description:",
        error
      );

      setAiError(
        error.response?.data?.error ||
          "Failed to generate project description."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Project name is required");
      return;
    }

    setFormError("");
    setSuccessMessage("");

    try {
      if (editingId) {
        await api.put(
          `/projects/${editingId}`,
          formData
        );
      } else {
        await api.post("/projects", formData);
      }

      setSuccessMessage(
        editingId
          ? "Project updated successfully"
          : "Project created successfully"
      );

      setFormData({
        name: "",
        description: "",
        status: "Todo",
        start_date: "",
        due_date: "",
      });

      setEditingId(null);

      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);

      setFormError(
        error.response?.data?.error ||
          "Failed to save project. Please try again."
      );
    }
  };

  const editProject = (project) => {
    setEditingId(project.id);

    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status,
      start_date: project.start_date
        ? project.start_date.substring(0, 10)
        : "",
      due_date: project.due_date
        ? project.due_date.substring(0, 10)
        : "",
    });

    setFormError("");
    setSuccessMessage("");
  };

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);

      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);

      setFormError(
        error.response?.data?.error ||
          "Failed to delete project. Please try again."
      );
    }
  };

  const filteredProjects = projects.filter((project) => {
    const searchMatch =
      project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      project.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const formatDate = (date) => {
    if (!date) {
      return "Not set";
    }

    const dateOnly = date.substring(0, 10);

    const [year, month, day] =
      dateOnly.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    return `status-badge ${status
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  return (
    <div className="projects-page">

      {/* Page Header */}
      <div className="page-header">
        <h1>Projects</h1>
        <p>Manage and track your projects.</p>
      </div>

      {/* Create / Edit Project */}
      <div className="project-form-section">

        <h2>
          {editingId
            ? "Edit Project"
            : "Create Project"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="project-form"
        >

          {/* Project Name */}
          <div className="form-field">
            <label>
              Project Name <span>*</span>
            </label>

            <input
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="form-field">
            <label>
              Status <span>*</span>
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Todo">
                Todo
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          {/* Description */}
          <div className="form-field description-field">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />

            <button
              type="button"
              className="ai-description-button"
              onClick={generateProjectDescription}
              disabled={aiLoading}
            >
              {aiLoading
                ? "Generating..."
                : "Generate Description with AI"}
            </button>

            {aiError && (
              <p className="form-error">
                {aiError}
              </p>
            )}
          </div>

          {/* Start Date */}
          <div className="form-field">
            <label>Start Date</label>

            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>

          {/* Due Date */}
          <div className="form-field">
            <label>Due Date</label>

            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

          {/* Error */}
          {formError && (
            <p className="form-error">
              {formError}
            </p>
          )}

          {/* Success */}
          {successMessage && (
            <p className="success-message">
              {successMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="submit-button"
          >
            {editingId
              ? "Update Project"
              : "Create Project"}
          </button>

        </form>
      </div>

      {/* Search and Filter */}
      <div className="project-controls">

        {/* Search FIRST */}
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        {/* Status SECOND */}
        <div className="filter-group">
          <label>Status:</label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All
            </option>

            <option value="Todo">
              Todo
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

      </div>

      {/* Projects List */}
      <div className="projects-list-section">

        <div className="projects-list-header">
          <h2>
            All Projects (
            {filteredProjects.length})
          </h2>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <p className="empty-state">
            No projects found.
          </p>
        ) : (
          <div className="projects-list">

            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="project-card"
              >

                {/* Card Header */}
                <div className="project-card-header">

                  <div>
                    <h3>{project.name}</h3>

                    {project.description && (
                      <p className="project-description">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="project-badges">

                    <span
                      className={getStatusClass(
                        project.status
                      )}
                    >
                      {project.status}
                    </span>

                  </div>

                </div>

                {/* Project Details */}
                <div className="project-details">

                  <div className="project-detail">
                    <span className="detail-label">
                      Progress
                    </span>

                    <span className="detail-value">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="project-detail">
                    <span className="detail-label">
                      Tasks
                    </span>

                    <span className="detail-value">
                      {project.completed_tasks} /{" "}
                      {project.total_tasks}
                    </span>
                  </div>

                  <div className="project-detail">
                    <span className="detail-label">
                      Start Date
                    </span>

                    <span className="detail-value">
                      {formatDate(
                        project.start_date
                      )}
                    </span>
                  </div>

                  <div className="project-detail">
                    <span className="detail-label">
                      Due Date
                    </span>

                    <span className="detail-value">
                      {formatDate(
                        project.due_date
                      )}
                    </span>
                  </div>

                </div>

                {/* Actions */}
                <div className="project-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      editProject(project)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteProject(project.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Projects;