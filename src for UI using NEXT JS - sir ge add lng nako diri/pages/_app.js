"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const API_URL = "http://localhost:5000/v1/task";

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      let url = API_URL;
      const params = [];
      if (search) params.push(`search=${search}`);
      if (filter) params.push(`status=${filter}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await fetch(url);
      const data = await res.json();

      // backend returns { message, data: [...] }
      setTasks(data.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filter]);

  // Create Task
  const createTask = async () => {
    if (!title) return alert("Title is required");
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status, deadline }),
      });
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDeadline("");
      fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // Update Task Status
  const updateTask = async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", border: "1px solid #ca4fcaff"}}>
      <h1 style={{color: "plum"}}>Task Manager</h1>

      {/* Create Task */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "20px" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "20px" }}
        />
        {/*New Deadline field */}
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ marginRight: "20px" }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginRight: "20px" }}>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={createTask}>Add Task</button>
      </div>

      {/* Search & Filter */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchTasks();
            }
          }}
          style={{ marginRight: "10px" }}
        />
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            fetchTasks();
          }}
          style={{ marginRight: "10px" }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={fetchTasks}>Search</button>
      </div>


      {/* Task List */}
      <ul>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              key={task._id}
              style={{
                marginBottom: "10px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
              }}
            >
              <strong>{task.title}</strong> ({task.status})
              <p>{task.description}</p>
              {/*Show deadline if exists */}
              {task.deadline && (
                <p>
                  <em>Deadline: {new Date(task.deadline).toLocaleDateString()}</em>
                </p>
              )}
              <div>
                {task.status !== "pending" && (
                  <button onClick={() => updateTask(task._id, "pending")}>Set Pending</button>
                )}
                {task.status !== "in-progress" && (
                  <button onClick={() => updateTask(task._id, "in-progress")}>Set In-Progress</button>
                )}
                {task.status !== "completed" && (
                  <button onClick={() => updateTask(task._id, "completed")}>Set Completed</button>
                )}
                <button onClick={() => deleteTask(task._id)} style={{ marginLeft: "20px", color: "red" }}>
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>
    </div>
  );
}
