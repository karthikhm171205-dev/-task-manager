const dns = require("dns");

// Fix MongoDB Atlas SRV DNS lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ==========================================
// CONNECT TO MONGODB
// ==========================================

connectDB();

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("Task Manager Backend is Running!");
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});