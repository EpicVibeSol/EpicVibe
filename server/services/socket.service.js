const jwt = require('jsonwebtoken');

/**
 * Socket.IO Service
 * Handles real-time communication for EpicVibe platform
 */
const socketService = (io) => {
  // Track connected users
  const connectedUsers = new Map();
  
  // Middleware for authentication
  io.use((socket, next) => {
    try {
      // Get token from handshake auth or query
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        // For demo purposes, allow connection without authentication
        socket.user = {
          id: `guest_${Math.random().toString(36).substring(2, 10)}`,
          username: 'Guest User',
          isGuest: true
        };
        return next();
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'epic-vibe-demo-secret');
      
      // Attach user data to socket
      socket.user = {
        id: decoded.id,
        username: decoded.username,
        walletAddress: decoded.walletAddress,
        isGuest: false
      };
      
      next();
    } catch (error) {
      // For demo purposes, fallback to guest user
      console.log('Socket authentication failed, connecting as guest:', error.message);
      socket.user = {
        id: `guest_${Math.random().toString(36).substring(2, 10)}`,
        username: 'Guest User',
        isGuest: true
      };
      next();
    }
  });
  
  // Connection event
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.user.username})`);
    
    // Add user to connected users
    connectedUsers.set(socket.user.id, {
      socketId: socket.id,
      user: socket.user,
      joinedAt: new Date()
    });
    
    // Emit welcome message
    socket.emit('welcome', {
      message: `Welcome to EpicVibe, ${socket.user.username}!`,
      user: socket.user,
      connectedUsers: connectedUsers.size
    });
    
    // Broadcast new user to everyone except the user
    socket.broadcast.emit('user:joined', {
      user: {
        id: socket.user.id,
        username: socket.user.username,
        isGuest: socket.user.isGuest
      },
      connectedUsers: connectedUsers.size,
      message: `${socket.user.username} joined the vibe!`
    });
    
    // Join rooms based on user
    const generalRoom = 'general';
    socket.join(generalRoom);
    
    if (!socket.user.isGuest) {
      // Join user-specific room for private messages
      socket.join(`user:${socket.user.id}`);
      
      // If user has wallet, join wallet room
      if (socket.user.walletAddress) {
        socket.join(`wallet:${socket.user.walletAddress}`);
      }
    }
    
    // === Chat events ===
    
    // Handle chat messages
    socket.on('chat:message', (data) => {
      const { message, room = generalRoom } = data;
      
      if (!message || !message.trim()) {
        return socket.emit('error', { message: 'Message cannot be empty' });
      }
      
      // Create message object
      const messageObj = {
        id: `msg_${Date.now()}`,
        user: {
          id: socket.user.id,
          username: socket.user.username,
          isGuest: socket.user.isGuest
        },
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      // Broadcast to room
      io.to(room).emit('chat:message', messageObj);
      
      // For demo: Log the message
      console.log(`Chat message in ${room}: ${socket.user.username}: ${message}`);
    });
    
    // Handle private messages
    socket.on('chat:privateMessage', (data) => {
      const { message, recipientId } = data;
      
      if (!message || !message.trim()) {
        return socket.emit('error', { message: 'Message cannot be empty' });
      }
      
      if (!recipientId) {
        return socket.emit('error', { message: 'Recipient is required' });
      }
      
      // Create message object
      const messageObj = {
        id: `msg_${Date.now()}`,
        user: {
          id: socket.user.id,
          username: socket.user.username
        },
        message: message.trim(),
        timestamp: new Date().toISOString(),
        isPrivate: true
      };
      
      // Send to recipient and sender
      io.to(`user:${recipientId}`).to(socket.id).emit('chat:privateMessage', messageObj);
      
      // For demo: Log the message
      console.log(`Private message to ${recipientId}: ${socket.user.username}: ${message}`);
    });
    
    // === Game events ===
    
    // Handle game creation updates
    socket.on('game:creating', (data) => {
      const { gameId, progress } = data;
      
      // Broadcast game creation progress
      socket.broadcast.emit('game:progress', {
        gameId,
        creator: {
          id: socket.user.id,
          username: socket.user.username
        },
        progress,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle game publication
    socket.on('game:published', (data) => {
      const { gameId, title, description, type, style } = data;
      
      // Broadcast new game to all users
      io.emit('game:new', {
        gameId,
        title,
        description,
        type,
        style,
        creator: {
          id: socket.user.id,
          username: socket.user.username
        },
        timestamp: new Date().toISOString()
      });
    });
    
    // === Wallet events ===
    
    // Handle token transactions
    socket.on('token:transaction', (data) => {
      const { recipientWallet, amount, reason } = data;
      
      if (recipientWallet) {
        // Notify recipient
        io.to(`wallet:${recipientWallet}`).emit('token:received', {
          amount,
          reason,
          from: socket.user.id,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // === Disconnection ===
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id} (User: ${socket.user.username})`);
      
      // Remove user from connected users
      connectedUsers.delete(socket.user.id);
      
      // Broadcast user left
      socket.broadcast.emit('user:left', {
        user: {
          id: socket.user.id,
          username: socket.user.username
        },
        connectedUsers: connectedUsers.size,
        message: `${socket.user.username} left the vibe.`
      });
    });
  });
  
  // Return methods for external usage
  return {
    /**
     * Get connected users count
     * @returns {number} Number of connected users
     */
    getConnectedUsersCount: () => {
      return connectedUsers.size;
    },
    
    /**
     * Send notification to specific user
     * @param {string} userId - User ID to notify
     * @param {string} event - Event name
     * @param {Object} data - Notification data
     */
    notifyUser: (userId, event, data) => {
      const userConnection = connectedUsers.get(userId);
      if (userConnection) {
        io.to(userConnection.socketId).emit(event, {
          ...data,
          timestamp: new Date().toISOString()
        });
      }
    },
    
    /**
     * Broadcast to all connected users
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    broadcastToAll: (event, data) => {
      io.emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  };
};

module.exports = socketService; 