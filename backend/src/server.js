const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "RemoteExecutor API is running",
  });
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

startServer();