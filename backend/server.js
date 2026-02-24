const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const grievanceRoutes = require("./routes/grievanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const issueRoutes = require("./routes/issueRoutes"); // ✅ NEW
const unitRoutes = require("./routes/unitRoutes");
const geoRoutes = require("./routes/geoRoutes");


const app = express();

/* ---------------------------
   MIDDLEWARE
---------------------------- */
app.use(cors());
app.use(express.json());

/* ---------------------------
   ROUTES
---------------------------- */
app.use("/api/units", unitRoutes);
app.use("/api/geo", geoRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Polavaram PGRS Backend Running");
});

// Authentication
app.use("/api/auth", authRoutes);

// Grievances
app.use("/api/grievances", grievanceRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// ✅ Issue Types (NEW)
app.use("/api/issue-types", issueRoutes);

/* ---------------------------
   SERVER START
---------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});