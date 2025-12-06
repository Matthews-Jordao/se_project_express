const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const app = express();

app.use(cors());

mongoose.connect('mongodb://localhost:27017/wtwr_db')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('Make sure MongoDB is running with: mongod');
  });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'An error occurred on the server' : err.message;
  res.status(statusCode).json({ message });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
