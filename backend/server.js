const connectDB = require("./db");
const express = require("express");
const cors = require("cors");
const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// GET tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.log(error);
  }
});

// ADD task
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      text: req.body.text,
      done: req.body.done,
      priority: req.body.priority,
      dueDate: req.body.dueDate
    });

    await newTask.save();

    res.json(newTask);

  } catch (error) {
    console.log(error);
  }
});

// UPDATE task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedTask);

  } catch (error) {
    console.log(error);
  }
});

// DELETE single task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted"
    });

  } catch (error) {
    console.log(error);
  }
});

// DELETE ALL tasks
app.delete("/tasks", async (req, res) => {
  try {
    await Task.deleteMany({});

    res.json({
      message: "All tasks deleted"
    });

  } catch (error) {
    console.log(error);
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    "Server running on port 5000"
  );
});