require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth.routes');
const gameRoutes = require('./routes/game.routes');
const userRoutes = require('./routes/user.routes');
const tokenRoutes = require('./routes/token.routes');
const aiRoutes = require('./routes/ai.routes');

// Import middlewares
const { authMiddleware } = require('./middlewares/auth.middleware');
const { errorHandler } = require('./middlewares/error.middleware');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection handler
require('./services/socket.service')(io);

// Connect to MongoDB (if available)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/tokens', authMiddleware, tokenRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '..', 'client')));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 EpicVibe server running on port ${PORT}`);
  console.log(`🎮 Game creation platform: ${process.env.CLIENT_URL || `http://localhost:${PORT}`}`);
  console.log(`🪙 Solana network: ${process.env.SOLANA_NETWORK || 'devnet'}`);
  console.log(`🧠 AI model: ${process.env.AI_MODEL_VERSION || 'gpt-4-turbo'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

module.exports = { app, server }; 