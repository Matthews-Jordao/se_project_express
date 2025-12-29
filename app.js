require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require('celebrate');

// Routes and middleware imports
const routes = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Initialize Express application
const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: ['https://www.wtwr.bad.mn', 'https://wtwr.bad.mn', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Serve static files (uploaded images)
app.use('/uploads', express.static('public/uploads'));

// Database connection
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    console.error("Make sure MongoDB is running with: mongod");
  });

// Database connection event handlers
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Enable request logging
app.use(requestLogger);

// Mount application routes
app.use(routes);

// Enable error logging
app.use(errorLogger);

// Celebrate error handler
app.use(errors());

// Centralized error handling middleware
app.use(errorHandler);

// Server configuration and startup
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
