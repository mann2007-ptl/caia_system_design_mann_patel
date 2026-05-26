const express = require("express");
const cors = require("cors");

// Import routes
const paginationRoutes = require("./routes/pagination.routes");
const sortRoutes = require("./routes/sort.routes");
const conceptRoutes = require("./routes/prompt.routes");
const taxonomyRoutes = require("./routes/taxonomy.routes");
const searchRoutes = require("./routes/search.routes");
const filterRoutes = require("./routes/filter.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const discoveryRoutes = require("./routes/discovery.routes");
const bookmarkRoutes = require("./routes/bookmark.routes");
const bulkOperationsRoutes = require("./routes/bulkOperations.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const systemRoutes = require("./routes/system.routes");
const protectedRoutes = require("./routes/protected.routes");
const validationRoutes = require("./routes/validation.routes");

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
app.use("/api/v1/concepts/bulk", bulkOperationsRoutes);
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
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/discovery", discoveryRoutes);
app.use("/api/v1", bookmarkRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", systemRoutes);
app.use("/api/v1", protectedRoutes);
app.use("/api/v1/validate", validationRoutes);

module.exports = app;