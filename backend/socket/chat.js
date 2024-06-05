const { db } = require("../config/firebase");
const { Message } = require("../models");
const { FieldValue } = require('firebase-admin/firestore');

const chatSocket = (io) => {
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

        // Emit the message to all clients in the room
        io.to(room).emit('chat message', { msg, room, sender });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.emit('initialTasks', tasks);

    // Handle task creation
    socket.on('createTask', (task) => {
      tasks.push(task);
      io.emit('taskCreated', task);  // Emit to all clients
    });

    // Handle task deletion
    socket.on('deleteTask', (taskId) => {
      tasks = tasks.filter(task => task.id !== taskId);
      io.emit('taskDeleted', taskId);  // Emit to all clients
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = chatSocket