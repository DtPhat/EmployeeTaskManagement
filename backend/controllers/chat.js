const { Message } = require("../models");

const getMessages = async (req, res) => {
  const room = req.params.room;
  try {
    const snapshot = await Message
      .where('room', '==', room)
      .orderBy('timestamp')
      .get();
    const messages = snapshot.docs.map(doc => doc.data());
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json('Error fetching messages');
  }
};

module.exports = {
  getMessages
}