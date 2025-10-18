
const express = require('express');
const mongoose = require('mongoose');

// Set up my MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());

// Quick test user middleware for now
app.use((req, res, next) => {
  req.user = {
  _id: '5d8b8592978f8bd833ca8133', // My test user _id
  };
  next();
});

// Hook up all my routes
const router = require('./routes');
app.use(router);

app.listen(PORT, () => {
  // just logging the port for sanity
  console.log(`Server running on http://localhost:${PORT}`);
});
