const express = require("express");
const cors = require("cors");

// Import routes
const conceptRoutes = require("./routes/prompt.routes");
const taxonomyRoutes = require("./routes/taxonomy.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/concepts", conceptRoutes);
app.use("/api/v1", taxonomyRoutes);

module.exports = app;