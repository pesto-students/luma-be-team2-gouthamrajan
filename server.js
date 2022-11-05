require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const errorHandler = require('./middleware/errorHandler');
const { router: Webrtc } = require('./webrtc/Webrtc');
const { router: registerRouter } = require('./routes/userRoutes');
const { router: expertRouter } = require('./routes/expertRoute');
const { router: adminRouter } = require('./routes/adminRoute');
const cors = require('cors');

connectDB();
const app = express();
app.use(express.json());
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/', (req, res) => {
  res.end('Hello from index!!!');
});

app.use(registerRouter);
app.use(expertRouter);
app.use(adminRouter);
app.use('/meeting', Webrtc);
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 5500, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
