```jsx
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message: "Unable to connect to server",
      };
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }

      return {
        success: true,
        message: "Registration successful! Please login.",
      };
    } catch (error) {
      console.error("Registration error:", error);

      return {
        success: false,
        message: "Unable to connect to server",
      };
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  // ==========================================
  // PAGE
  // ==========================================

  if (token) {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  return (
    <AuthPage
      showRegister={showRegister}
      setShowRegister={setShowRegister}
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
  );
}

// ==================================================
// AUTH PAGE
// ==================================================

function AuthPage({
  showRegister,
  setShowRegister,
  onLogin,
  onRegister,
}) {
  return (
    <div className="auth-container">
      {showRegister ? (
        <Register
          onRegister={onRegister}
          onSwitch={() => setShowRegister(false)}
        />
      ) : (
        <Login
          onLogin={onLogin}
          onSwitch={() => setShowRegister(true)}
        />
      )}
    </div>
  );
}

// ==================================================
// LOGIN
// ==================================================

function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setMessage("Logging in...");

    const result = await onLogin(email, password);

    if (!result.success) {
      setMessage(result.message);
    }
  };

  return (
    <div className="auth-box">
      <h1>Task Manager</h1>
      <h2>Login</h2>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p>Don't have an account?</p>

      <button className="switch-button" onClick={onSwitch}>
        Create Account
      </button>
    </div>
  );
}

// ==================================================
// REGISTER
// ==================================================

function Register({ onRegister, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setMessage("Creating account...");

    const result = await onRegister(name, email, password);

    if (result.success) {
      setMessage(result.message);

      setTimeout(() => {
        onSwitch();
      }, 1000);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="auth-box">
      <h1>Task Manager</h1>
      <h2>Create Account</h2>

      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p>Already have an account?</p>

      <button className="switch-button" onClick={onSwitch}>
        Back to Login
      </button>
    </div>
  );
}

// ==================================================
// DASHBOARD
// ==================================================

function Dashboard({ token, onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");

  // Search and filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // ==========================================
  // LOGOUT IF TOKEN IS INVALID
  // ==========================================

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // ==========================================
  // FETCH TASKS
  // ==========================================

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        setMessage(data.message || "Failed to fetch tasks");
        return;
      }

      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setMessage("Unable to connect to server");
    }
  };

  // ==========================================
  // LOAD TASKS
  // ==========================================

  useEffect(() => {
    fetchTasks();
  }, []);

  // ==========================================
  // CREATE / UPDATE TASK
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Task title is required");
      return;
    }

    const taskData = {
      title: title.trim(),
      description,
      status,
      priority,
      dueDate: dueDate || undefined,
    };

    try {
      const url = editingId
        ? `${API_URL}/api/tasks/${editingId}`
        : `${API_URL}/api/tasks`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        setMessage(data.message || "Operation failed");
        return;
      }

      setMessage(
        editingId
          ? "Task updated successfully! ✅"
          : "Task created successfully! ✅"
      );

      clearForm();
      fetchTasks();
    } catch (error) {
      console.error("Task operation error:", error);
      setMessage("Unable to connect to server");
    }
  };

  // ==========================================
  // EDIT TASK
  // ==========================================

  const handleEdit = (task) => {
    setEditingId(task._id);

    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status || "pending");
    setPriority(task.priority || "medium");

    if (task.dueDate) {
      setDueDate(
        new Date(task.dueDate).toISOString().split("T")[0]
      );
    } else {
      setDueDate("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        setMessage(data.message || "Failed to delete task");
        return;
      }

      setMessage("Task deleted successfully! 🗑️");

      if (editingId === id) {
        clearForm();
      }

      fetchTasks();
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Unable to connect to server");
    }
  };

  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setPriority("medium");
    setDueDate("");
    setEditingId(null);
  };

  // ==========================================
  // FILTER TASKS
  // ==========================================

  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      (task.description || "").toLowerCase().includes(searchText);

    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;

    const matchesPriority =
      filterPriority === "all" ||
      (task.priority || "medium") === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ==========================================
  // COUNTERS
  // ==========================================

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const progressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  // ==========================================
  // PRIORITY LABEL
  // ==========================================

  const getPriorityLabel = (priorityValue) => {
    switch (priorityValue) {
      case "low":
        return "Low";

      case "high":
        return "High";

      default:
        return "Medium";
    }
  };

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <div className="dashboard">
      {/* NAVBAR */}

      <header className="navbar">
        <div>
          <h1>Task Manager</h1>

          <p>
            Welcome, <strong>{user.name || "User"}</strong> 👋
          </p>
        </div>

        <button onClick={onLogout}>Logout</button>
      </header>

      <main className="content">
        {/* STATISTICS */}

        <div className="stats">
          <div className="stat-card">
            <h3>Total</h3>
            <strong>{totalTasks}</strong>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <strong>{pendingTasks}</strong>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <strong>{progressTasks}</strong>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <strong>{completedTasks}</strong>
          </div>

          <div className="stat-card">
            <h3>High Priority</h3>
            <strong>{highPriorityTasks}</strong>
          </div>
        </div>

        {/* CREATE / EDIT TASK */}

        <section className="create-section">
          <h2>
            {editingId ? "Edit Task" : "Create New Task"}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* PRIORITY */}

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            {/* DUE DATE */}

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button type="submit">
              {editingId ? "Update Task" : "Create Task"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* MESSAGE */}

        {message && <p className="message">{message}</p>}

        {/* SEARCH + FILTER */}

        <div className="task-controls">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        {/* TASK LIST */}

        <section>
          <h2>My Tasks</h2>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks found</h3>

              <p>
                Create a task or change your search/filter.
              </p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <div className="task-header">
                    <h3>{task.title}</h3>

                    <span
                      className={`status-badge ${
                        task.status
                      }`}
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status}
                    </span>
                  </div>

                  {/* PRIORITY */}

                  <p className="priority">
                    Priority:{" "}
                    <strong>
                      {getPriorityLabel(
                        task.priority || "medium"
                      )}
                    </strong>
                  </p>

                  <p className="description">
                    {task.description || "No description"}
                  </p>

                  {task.dueDate && (
                    <p className="due-date">
                      📅 Due:{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}
                    </p>
                  )}

                  <div className="task-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(task._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
```
