require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const errorHandler = require('./middleware/errorHandler');
const { router: Webrtc } = require('./webrtc/Webrtc');
const { router: registerRouter } = require('./user/User');
const { router: expertRouter } = require('./expert/Expert');
const { router: adminRouter } = require('./admin/Admin');
const cors = require('cors');

connectDB();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
app.use(registerRouter);
app.use(expertRouter);
app.use(adminRouter);
app.use('/meeting', Webrtc);
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 4000, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
