import { useEffect, useState } from "react";
import api from "../api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [aiTasks, setAiTasks] = useState("");
  const [aiTaskLoading, setAiTaskLoading] = useState(false);
  const [aiTaskError, setAiTaskError] = useState("");
  const [aiDescriptionLoading, setAiDescriptionLoading] = useState(false);
  const [aiDescriptionError, setAiDescriptionError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    project_id: "",
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    due_date: "",
    assignee: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tasks");

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);

      setFormError(
        error.response?.data?.error ||
          "Failed to load tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");

      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const generateAiTasks = async () => {
  if (!formData.project_id) {
    setAiTaskError("Please select a project first.");
    return;
  }

  const selectedProject = projects.find(
    (project) =>
      String(project.id) === String(formData.project_id)
  );

  if (!selectedProject) {
    setAiTaskError("Selected project was not found.");
    return;
  }

  try {
    setAiTaskLoading(true);
    setAiTaskError("");
    setAiTasks("");

    const response = await api.post(
      "/ai/generate-tasks",
      {
        projectName: selectedProject.name,
      }
    );

    setAiTasks(response.data.tasks);
  } catch (error) {
    console.error("Error generating AI tasks:", error);

    setAiTaskError(
      error.response?.data?.error ||
        "Failed to generate tasks. Please try again."
    );
  } finally {
    setAiTaskLoading(false);
  }
};

const generateAiTaskDescription = async () => {
  if (!formData.title.trim()) {
    setAiDescriptionError("Please enter a task title first.");
    return;
  }

  try {
    setAiDescriptionLoading(true);
    setAiDescriptionError("");

    const response = await api.post(
      "/ai/generate-task-description",
      {
        taskName: formData.title,
      }
    );

    setFormData({
      ...formData,
      description: response.data.description,
    });
  } catch (error) {
    console.error(
      "Error generating task description:",
      error
    );

    setAiDescriptionError(
      error.response?.data?.error ||
        "Failed to generate task description. Please try again."
    );
  } finally {
    setAiDescriptionLoading(false);
  }
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.project_id) {
      setFormError("Please select a project");
      return;
    }

    if (!formData.title.trim()) {
      setFormError("Task title is required");
      return;
    }

    setFormError("");
    setSuccessMessage("");

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
      } else {
        await api.post("/tasks", formData);
      }

      setSuccessMessage(
        editingId
          ? "Task updated successfully"
          : "Task created successfully"
      );

      setFormData({
        project_id: "",
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        due_date: "",
        assignee: "",
      });

      setEditingId(null);

      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);

      setFormError(
        error.response?.data?.error ||
          "Failed to save task. Please try again."
      );
    }
  };

  const editTask = (task) => {
    setEditingId(task.id);

    setFormData({
      project_id: task.project_id,
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      due_date: task.due_date
        ? task.due_date.substring(0, 10)
        : "",
      assignee: task.assignee || "",
    });

    setFormError("");
    setSuccessMessage("");
  };

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);

      setFormError(
        error.response?.data?.error ||
          "Failed to delete task. Please try again."
      );
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      statusFilter === "All" ||
      task.status === statusFilter;

    const priorityMatch =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    const projectMatch =
      projectFilter === "All" ||
      String(task.project_id) === String(projectFilter);

    const searchMatch =
      task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      task.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      task.assignee
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return (
      statusMatch &&
      priorityMatch &&
      projectMatch &&
      searchMatch
    );
  });

  const getProjectName = (projectId) => {
    const project = projects.find(
      (project) => String(project.id) === String(projectId)
    );

    return project ? project.name : "Unknown Project";
  };

  const formatDate = (date) => {
    if (!date) {
      return "No due date";
    }

    const dateOnly = date.substring(0, 10);

    const [year, month, day] = dateOnly.split("-");

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
      .replace(" ", "-")}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-badge ${priority.toLowerCase()}`;
  };

  return (
    <div className="tasks-page">

      {/* Page Header */}
      <div className="page-header">
        <h1>Tasks</h1>
        <p>Manage and track your project tasks.</p>
      </div>

      {/* Search and Filters */}
      <div className="task-controls">

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <div className="filter-group">
          <label>Status:</label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Priority:</label>

          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Project:</label>

          <select
            value={projectFilter}
            onChange={(event) =>
              setProjectFilter(event.target.value)
            }
          >
            <option value="All">All</option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* AI Task Generator */}
        <div className="ai-task-section">
          <div className="page-header">
            <h2>AI Task Generator</h2>
            <p>
              Select a project and let AI suggest practical development tasks.
            </p>
          </div>

          <div className="ai-task-form">

            <div className="form-field">
              <label>Project</label>

              <select
                value={formData.project_id}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    project_id: event.target.value,
                  })
                }
              >
                <option value="">Select Project</option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {aiTaskError && (
              <p className="form-error">
                {aiTaskError}
              </p>
            )}

            <button
              type="button"
              className="ai-button"
              onClick={generateAiTasks}
              disabled={aiTaskLoading}
            >
              {aiTaskLoading
                ? "Generating..."
                : "Generate Tasks with AI"}
            </button>
          </div>

          {aiTasks && (
            <div className="ai-results">
              <h3>AI Suggested Tasks</h3>
              <pre>{aiTasks}</pre>
            </div>
          )}
        </div>

      {/* Create / Edit Task */}
      <div className="task-form-section">

        <h2>
          {editingId ? "Edit Task" : "Create Task"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="task-form"
        >

          {/* Project */}
          <div className="form-field">
            <label>
              Project <span>*</span>
            </label>

            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
            >
              <option value="">
                Select Project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div className="form-field">
            <label>
              Task Title <span>*</span>
            </label>

            <input
              name="title"
              placeholder="Enter task title"
              value={formData.title}
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
              <option value="Pending">
                Pending
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
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />

            <button
              type="button"
              className="ai-description-button"
              onClick={generateAiTaskDescription}
              disabled={aiDescriptionLoading}
            >
              {aiDescriptionLoading
                ? "Generating..."
                : "Generate Description with AI"}
            </button>

            {aiDescriptionError && (
              <p className="form-error">
                {aiDescriptionError}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="form-field">
            <label>
              Priority <span>*</span>
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="form-field">
            <label>
              Due Date <span>*</span>
            </label>

            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

          {/* Assignee */}
          <div className="form-field">
            <label>
              Assignee <span>*</span>
            </label>

            <input
              name="assignee"
              placeholder="Enter assignee name"
              value={formData.assignee}
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
              ? "Update Task"
              : "Create Task"}
          </button>

        </form>
      </div>

      {/* Tasks List */}
      <div className="tasks-list-section">

        <div className="tasks-list-header">
          <h2>
            All Tasks ({filteredTasks.length})
          </h2>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="empty-state">
            No tasks found.
          </p>
        ) : (
          <div className="tasks-list">

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="task-card"
              >

                {/* Card Header */}
                <div className="task-card-header">

                  <div>
                    <h3>{task.title}</h3>

                    {task.description && (
                      <p className="task-description">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="task-badges">
                    <span
                      className={getStatusClass(
                        task.status
                      )}
                    >
                      {task.status}
                    </span>

                    <span
                      className={getPriorityClass(
                        task.priority
                      )}
                    >
                      {task.priority}
                    </span>
                  </div>

                </div>

                {/* Task Details */}
                <div className="task-details">

                  <div className="task-detail">
                    <span className="detail-label">
                      Project
                    </span>

                    <span className="detail-value">
                      {getProjectName(
                        task.project_id
                      )}
                    </span>
                  </div>

                  <div className="task-detail">
                    <span className="detail-label">
                      Due Date
                    </span>

                    <span className="detail-value">
                      {formatDate(task.due_date)}
                    </span>
                  </div>

                  <div className="task-detail">
                    <span className="detail-label">
                      Assignee
                    </span>

                    <span className="detail-value">
                      {task.assignee ||
                        "Not assigned"}
                    </span>
                  </div>

                </div>

                {/* Actions */}
                <div className="task-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      editTask(task)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteTask(task.id)
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

export default Tasks;