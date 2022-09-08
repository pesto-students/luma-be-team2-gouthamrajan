require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const errorHandler = require('./middleware/errorHandler');
const { router: registerRouter } = require('./register/User');

connectDB();
const app = express();

app.use(express.json());

app.use('/', registerRouter);

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 4000, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
