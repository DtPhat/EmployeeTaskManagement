const { db } = require("../config/firebase");
const { roles } = require("../utils/constants");
const { Task, User } = require("../models");

const createTask = async (req, res) => {
  try {
    const { assignee, startDate, dueDate, name, description, status } = req.body;
    const newTask = {
      assignee,
      startDate: new Date(startDate),
      dueDate: new Date(dueDate),
      name,
      description,
      status,
      reporter: req.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log(newTask);
    const taskDoc = await Task.add(newTask);
    res.status(201).json({
      message: 'Task created successfully',
      data: { id: taskDoc.id, ...newTask }
    }
    );

  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getUserDetails = async (userId) => {
  const userDoc = await User.doc(userId).get();
  return userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;
};

const getTasks = async (req, res) => {
  try {
    const userRole = req.userRole;
    const userId = req.userId;

    let snapshot;

    if (userRole == roles.OWNER) {
      snapshot = await Task.get();
    }
    if (userRole == roles.EMPLOYEE) {
      snapshot = await Task.where('assignee', '==', userId).get();
    }

    if (!snapshot) {
      return res.status(403).json('Access denied');
    }

    const tasks = await Promise.all(snapshot.docs.map(async (doc) => {
      const taskData = doc.data();
      const assignee = await getUserDetails(taskData.assignee);
      const reporter = await getUserDetails(taskData.reporter);
      return {
        id: doc.id,
        ...taskData,
        assignee,
        reporter
      };
    }));

    res.status(200).json({
      message: 'Success',
      data: tasks
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignee, startDate, dueDate, name, description, status, reporter } = req.body;

    const updatedTask = {
      assignee,
      startDate: new Date(startDate),
      dueDate: new Date(dueDate),
      name,
      description,
      status,
      reporter,
      updatedAt: new Date()
    };

    const docRef = Task.doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await docRef.set(updatedTask, { merge: true });

    const assigneeDetails = await getUserDetails(assignee);
    const reporterDetails = await getUserDetails(reporter);

    res.status(200).json({
      data: { id, ...updatedTask, assignee: assigneeDetails, reporter: reporterDetails },
      message: 'Success'
    }
    );
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = {
      status,
    };

    const docRef = Task.doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.userRole !== roles.OWNER && doc.data().assignee != req.userId) {
      return res.status(401).json({ message: 'Task is not belong to user' });
    }

    await docRef.set(updatedTask, { merge: true });

    res.status(200).json({
      message: 'Success'
    }
    );
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = Task.doc(id);

    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).send('Task not found');
    }

    await Task.doc(id).delete();
    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
}