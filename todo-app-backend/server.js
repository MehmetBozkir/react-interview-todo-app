const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));

const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");

app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
