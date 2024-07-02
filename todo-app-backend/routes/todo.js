const express = require("express");
const ToDo = require("../models/ToDo");
const authenticate = require("../middleware/auth");
const multer = require('multer');
const path = require('path');
const { z } = require("zod");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimeType = fileTypes.test(file.mimetype);
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
      return cb(null, true);
  } else {
      cb('Error: File upload only supports the following file types - ' + fileTypes);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
});

const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

router.post("/", authenticate, upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    todoSchema.parse({ title, description, tags: parsedTags });

    const todo = new ToDo({
      userId: req.userId,
      title,
      description,
      tags: parsedTags,
      thumbnail: req.file
        ? { filename: req.file.filename, url: `/uploads/${req.file.filename}` }
        : undefined,
    });
    await todo.save();
    res.status(201).send(todo);
  } catch (error) {
    res.status(400).send({ error: error.errors || error.message });
  }
});

router.get("/", authenticate, async (req, res) => {
  const todos = await ToDo.find({ userId: req.userId });
  res.send(todos);
});

router.put("/:id", authenticate, upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    todoSchema.parse({ title, description, tags: parsedTags });

    const { id } = req.params;
    const todo = await ToDo.findById(id);
    if (!todo || todo.userId.toString() !== req.userId) {
      return res.status(404).send({ error: "To-Do not found" });
    }

    Object.assign(todo, { title, description, tags: parsedTags });
    if (req.file) {
      todo.thumbnail = { filename: req.file.filename, url: `/uploads/${req.file.filename}` };
    }
    await todo.save();
    res.send(todo);
  } catch (error) {
    res.status(400).send({ error: error.errors || error.message });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const todo = await ToDo.findById(id);
  if (!todo || todo.userId.toString() !== req.userId) {
    return res.status(404).send({ error: "To-Do not found" });
  }
  await ToDo.findByIdAndDelete(id);
  res.send({ message: "To-Do deleted" });
});

module.exports = router;