const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const app = express();


app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  // Server listening on port
});

module.exports = app;
