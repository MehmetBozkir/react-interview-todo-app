const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    tags: [String],
    attachments: [{ filename: String, url: String }],
    thumbnail: { filename: String, url: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ToDo", ToDoSchema);
