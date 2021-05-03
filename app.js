const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const multerSettings = require('./utils/multer');
// app.set('Access-Control-Allow-Origin', 'http://localhost:3000');
// const socket = require("socket.io");

require('dotenv').config();

// Multer middleware
app.all('*', multerSettings);

//Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  credentials: true,
  origin: 'https://free-psy.herokuapp.com'
}));

// app.use(cors())

//Cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/uploads', express.static('uploads'));

const mongoBDProd = process.env.MONGO_DB_URI

mongoose.connect(mongoBDProd || 'mongodb://localhost:27017/psy', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected')
});

// Routes
const auth = require('./routes/auth');
const users = require('./routes/users');

//Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

const port = process.env.PORT || 5050;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});

// Socket setup
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
});

require('./utils/socket')(io)

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
