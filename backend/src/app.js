const express = require("express");
const cors = require("cors");

// Import routes
const paginationRoutes = require("./routes/pagination.routes");
const sortRoutes = require("./routes/sort.routes");
const conceptRoutes = require("./routes/prompt.routes");
const taxonomyRoutes = require("./routes/taxonomy.routes");
const searchRoutes = require("./routes/search.routes");
const filterRoutes = require("./routes/filter.routes");

// Import paginated controllers for cross-domain routes
const {
    getPaginatedCategories,
    getPaginatedPatterns,
    getPaginatedSearchResults
} = require("./controllers/pagination.controller");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Standard Routes
app.use("/api/v1/concepts", sortRoutes);
app.use("/api/v1/concepts", paginationRoutes);
app.use("/api/v1/concepts", conceptRoutes);

// Explicitly route cross-domain paginated routes BEFORE their base routers to avoid conflicts
app.get("/api/v1/categories", getPaginatedCategories);
app.get("/api/v1/patterns", getPaginatedPatterns);
app.get("/api/v1/search/results", getPaginatedSearchResults);

// Base Routers
app.use("/api/v1", taxonomyRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/filter", filterRoutes);

module.exports = app;