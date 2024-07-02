const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { z } = require("zod");

const router = express.Router();

const registerSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post("/register", async (req, res) => {
  try {
    registerSchema.parse(req.body);
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).send(error.errors);
  }
});

router.post("/login", async (req, res) => {
  try {
    loginSchema.parse(req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });
    res.send({ token });
  } catch (error) {
    res.status(400).send(error.errors);
  }
});

module.exports = router;
