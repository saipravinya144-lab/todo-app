import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://todo-app-3-r8rk.onrender.com";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  // ---------------- FETCH ----------------
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ---------------- ADD ----------------
  const addTask = async () => {
    if (!task.trim()) return;

    try {
      await axios.post(`${BASE_URL}/tasks`, {
        text: task,
        done: false,
        priority,
        dueDate,
      });

      setTask("");
      setPriority("Medium");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      console.log("Add error:", err);
    }
  };

  // ---------------- TOGGLE ----------------
  const toggleTask = async (item) => {
    try {
      await axios.put(`${BASE_URL}/tasks/${item._id}`, {
        done: !item.done,
      });

      fetchTasks();
    } catch (err) {
      console.log("Toggle error:", err);
    }
  };

  // ---------------- DELETE ----------------
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ---------------- CLEAR ALL ----------------
  const clearAllTasks = async () => {
    try {
      await axios.delete(`${BASE_URL}/tasks`);
      fetchTasks();
    } catch (err) {
      console.log("Clear error:", err);
    }
  };

  // ---------------- EDIT ----------------
  const editTask = (item) => {
    setEditId(item._id);
    setEditText(item.text);
  };

  const saveTask = async () => {
    if (!editText.trim()) return;

    try {
      await axios.put(`${BASE_URL}/tasks/${editId}`, {
        text: editText,
      });

      setEditId(null);
      setEditText("");
      fetchTasks();
    } catch (err) {
      console.log("Edit error:", err);
    }
  };

  // ---------------- FILTER + SEARCH ----------------
  const filteredTasks = tasks.filter((item) => {
    const match = item.text
      ?.toLowerCase()
      .includes(search.toLowerCase());

    if (!match) return false;

    if (filter === "completed") return item.done;
    if (filter === "pending") return !item.done;

    return true;
  });

  const completed = tasks.filter((t) => t.done).length;
  const progress =
    tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

  // ---------------- UI ----------------
  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>

      <h1>📝 My To-Do App</h1>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      {/* INPUT */}
      <input
        value={task}
        placeholder="Enter task"
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask();
        }}
      />

      {/* PRIORITY */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* DATE */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* BUTTONS */}
      <button onClick={addTask}>➕ Add</button>
      <button onClick={clearAllTasks}>🗑 Clear All</button>

      {/* FILTER */}
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* STATS */}
      <p>Total: {tasks.length}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {tasks.length - completed}</p>

      {/* PROGRESS */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* TASK LIST */}
      <ul>
        {filteredTasks.map((item) => (
          <li key={item._id}>

            {editId === item._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={saveTask}>💾 Save</button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTask(item)}
                  style={{
                    cursor: "pointer",
                    textDecoration: item.done ? "line-through" : "none",
                  }}
                >
                  {item.text}
                </span>

                <p>⭐ Priority: {item.priority}</p>
                <p>📅 Due: {item.dueDate}</p>

                <button onClick={() => editTask(item)}>✏ Edit</button>
              </>
            )}

            <button onClick={() => deleteTask(item._id)}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}