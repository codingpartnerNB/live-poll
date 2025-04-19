require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const pollRoutes = require('./routes/pollRoutes');
const userRoutes = require('./routes/userRoutes');
const { setupSocketHandlers } = require('./socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/polls', pollRoutes);
app.use('/api/users', userRoutes);

// Socket setup
setupSocketHandlers(io);

// Placeholder for initializeData
const initializeData = () => {
  console.log('Initializing data...');
  // Add any initialization logic here
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    initializeData();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Default route
app.get('/', (req, res) => {
  res.send('Live Poll Battle API is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});