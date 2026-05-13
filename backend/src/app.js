const express = require("express");
const cors = require("cors");

// Import routes
const conceptRoutes = require("./routes/prompt.routes");

const app = express();

// Middlewares
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse JSON request bodies

// Routes
app.use("/api/v1/concepts", conceptRoutes);

module.exports = app;