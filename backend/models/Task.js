const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },

  done: {
    type: Boolean,
    default: false
  },

  priority: {
    type: String,
    default: "Medium"
  },

  dueDate: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model(
  "Task",
  taskSchema
);