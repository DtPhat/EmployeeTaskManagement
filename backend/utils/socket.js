const { db } = require("../config/firebase");
const { Message } = require("../models");
const { FieldValue } = require('firebase-admin/firestore');

const socket = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join room', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on('chat message', async ({ msg, room, sender }) => {
      try {
        // Save message to Firestore
        await Message.add({
          text: msg,
          room: room,
          sender: sender,
          timestamp: FieldValue.serverTimestamp()
        });
        io.to(room).emit('chat message', { msg, room, sender });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('taskAdded', (task) => {
      io.emit('taskAdded', task); // Broadcast to all clients
    });

    socket.on('taskUpdated', (task) => {
      io.emit('taskUpdated', task); // Broadcast to all clients
    });

    socket.on('taskDeleted', (taskId) => {
      console.log("ID:" , taskId)
      io.emit('taskDeleted', taskId); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = socket