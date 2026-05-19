const express = require("express");
const cors = require("cors");

// Import routes
const paginationRoutes = require("./routes/pagination.routes");
const conceptRoutes = require("./routes/prompt.routes");
const taxonomyRoutes = require("./routes/taxonomy.routes");
const searchRoutes = require("./routes/search.routes");
const filterRoutes = require("./routes/filter.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/concepts", paginationRoutes);
app.use("/api/v1/concepts", conceptRoutes);
app.use("/api/v1", taxonomyRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/filter", filterRoutes);

module.exports = app;