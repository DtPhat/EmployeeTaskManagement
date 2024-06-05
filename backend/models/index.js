const { db } = require("../config/firebase");

const User = db.collection('users')
const Message = db.collection('messages')
const Task = db.collection('tasks')


module.exports = {
  User,
  Message,
  Task
}

  