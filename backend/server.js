const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ---------------- DATABASE CONNECTION ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ---------------- SCHEMA ----------------
const TaskSchema = new mongoose.Schema({
  text: String,
  done: Boolean,
  priority: String,
  dueDate: String,
});

const Task = mongoose.model("Task", TaskSchema);

// ---------------- ROUTES ----------------

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add task
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete one task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete all tasks
app.delete("/tasks", async (req, res) => {
  try {
    await Task.deleteMany();
    res.json({ message: "All tasks deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});