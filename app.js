const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const cors = require("cors");

const app = express();


app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
