const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { connectDB, swagger, app: appConfig } = require("./config");

const driversRoutes = require("./routes/v1/drivers");
const racesRoutes = require("./routes/v1/races");
const circuitsRoutes = require("./routes/v1/circuits");
const resultsRoutes = require("./routes/v1/results");

const { f1ErrorHandler } = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");

const app = express();

connectDB();

app.use(helmet()); // Adds various HTTP headers for security
app.use(cors()); // Enable CORS

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use("/api-docs", swagger.serve, swagger.setup);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

const apiRouter = express.Router();

apiRouter.use("/drivers", driversRoutes);
apiRouter.use("/races", racesRoutes);
apiRouter.use("/circuits", circuitsRoutes);
apiRouter.use("/results", resultsRoutes);

app.use("/api", apiRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(f1ErrorHandler);

// Export app for server.js
module.exports = app;

// Start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
    console.log(
      `API Documentation available at http://localhost:${PORT}/api-docs`
    );
  });
}
